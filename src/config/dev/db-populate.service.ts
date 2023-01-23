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
import { buecher } from './testdaten.js';
import { configDir } from '../node.js';
import { getLogger } from '../../logger/logger.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Die Test-DB wird im Development-Modus neu geladen, nachdem die Module
 * initialisiert sind, was duch `OnApplicationBootstrap` realisiert wird.
 *
 * DB-Migration mit TypeORM (ohne Nest): https://typeorm.io/migrations
 */
@Injectable()
export class DbPopulateService implements OnApplicationBootstrap {
    readonly #repo: Repository<Buch>;

    readonly #logger = getLogger(DbPopulateService.name);

    readonly #buecher = buecher;

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

        await (typeOrmModuleOptions.type === 'postgres'
            ? this.#populatePostgres()
            : this.#populateMySQL());
    }

    async #populatePostgres() {
        const basePath = resolve(
            configDir,
            'dev',
            typeOrmModuleOptions.type!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        );
        this.#logger.warn(`${typeOrmModuleOptions.type}: DB wird neu geladen`);

        const dropScript = resolve(basePath, 'drop.sql');
        // https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
        const dropSql = readFileSync(dropScript, 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
        await this.#repo.query(dropSql);

        const createScript = resolve(basePath, 'create.sql');
        // https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
        const createSql = readFileSync(createScript, 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
        await this.#repo.query(createSql);

        const saved = await this.#repo.save(this.#buecher);
        this.#logger.warn(
            '#populatePostgres: %d Datensaetze eingefuegt',
            saved.length,
        );
    }

    async #populateMySQL() {
        const tabelle = Buch.name.toLowerCase();
        this.#logger.warn(
            `${typeOrmModuleOptions.type}: Tabelle ${tabelle} wird geloescht`,
        );
        await this.#repo.query(
            `DROP TABLE IF EXISTS ${Buch.name.toLowerCase()};`,
        );

        const scriptDir = resolve(configDir, 'dev', typeOrmModuleOptions.type!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        const createScript = resolve(scriptDir, 'create-table-buch.sql');
        const sql = readFileSync(createScript, 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename
        await this.#repo.query(sql);

        const saved = await this.#repo.save(this.#buecher);
        this.#logger.warn(
            '#populateMySQL: %d Datensaetze eingefuegt',
            saved.length,
        );
    }
}
