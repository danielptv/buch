/*
 * Copyright (C) 2021 - present Juergen Zimmermann, Florian Goebel, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Das Modul enthält die Funktion, um die Test-DB neu zu laden.
 * @packageDocumentation
 */

import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import { dbPopulate, typeOrmModuleOptions } from '../db.js';
import { Buch } from '../../buch/entity/buch.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configDir } from '../node.js';
import { getLogger } from '../../logger/logger.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Die Test-DB wird im Development-Modus neu geladen, nachdem die Module
 * initialisiert sind, was durch `OnApplicationBootstrap` realisiert wird.
 *
 * DB-Migration mit TypeORM (ohne Nest): https://typeorm.io/migrations
 */
@Injectable()
export class DbPopulateService implements OnApplicationBootstrap {
    readonly #repo: Repository<Buch>;

    readonly #logger = getLogger(DbPopulateService.name);

    /**
     * Initialisierung durch DI mit `Repository<Buch>` gemäß _TypeORM_.
     */
    constructor(@InjectRepository(Buch) repo: Repository<Buch>) {
        this.#repo = repo;
    }

    /**
     * Die Test-DB wird im Development-Modus neu geladen.
     */
    async onApplicationBootstrap() {
        await this.populateTestdaten();
    }

    async populateTestdaten() {
        if (!dbPopulate) {
            return;
        }

        const basePath = resolve(
            configDir,
            'dev',
            typeOrmModuleOptions.type!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        );
        this.#logger.warn(`${typeOrmModuleOptions.type}: DB wird neu geladen`);
        await (typeOrmModuleOptions.type === 'postgres'
            ? this.#populatePostgres(basePath)
            : this.#populatePerStatement(basePath));
    }

    async #populatePostgres(basePath: string) {
        const dropScript = resolve(basePath, 'drop.sql');
        // https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
        const dropStatements = readFileSync(dropScript, 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
        await this.#repo.query(dropStatements);

        const createScript = resolve(basePath, 'create.sql');
        // https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
        const createStatements = readFileSync(createScript, 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
        await this.#repo.query(createStatements);

        const insertScript = resolve(basePath, 'insert.sql');
        // https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
        const insertStatements = readFileSync(insertScript, 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
        await this.#repo.query(insertStatements);
    }

    // repo.query() kann bei MySQL und SQLite nur 1 Anweisung mit "raw SQL" ausfuehren
    async #populatePerStatement(basePath: string) {
        const dropScript = resolve(basePath, 'drop.sql');
        await this.#executeStatements(dropScript);

        const createScript = resolve(basePath, 'create.sql');
        await this.#executeStatements(createScript);

        const insertScript = resolve(basePath, 'insert.sql');
        await this.#executeStatements(insertScript);
    }

    async #executeStatements(script: string) {
        // https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js#answer-17332534
        // alternativ: https://nodejs.org/api/fs.html#fspromisesopenpath-flags-mode
        const statements: string[] = [];
        let statement = '';
        readFileSync(script, 'utf8') // eslint-disable-line security/detect-non-literal-fs-filename
            // bei Zeilenumbruch einen neuen String erstellen
            .split(/\r?\n/u)
            // Kommentarzeilen entfernen
            .filter((line) => !line.includes('--'))
            // Eine Anweisung aus mehreren Zeilen bis zum Semikolon zusammenfuegen
            .forEach((line) => {
                statement += line;
                if (line.endsWith(';')) {
                    statements.push(statement);
                    statement = '';
                }
            });

        for (statement of statements) {
            await this.#repo.query(statement);
        }
    }
}
