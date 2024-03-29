/*
 * Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe
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
 * Das Modul enthält die Konfiguration für den Zugriff auf die DB.
 * @packageDocumentation
 */
import { Buch } from '../buch/entity/buch.entity.js';
import { type DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from './buch-config.js';
import { dbType } from './dbtype.js';
import { entities } from '../buch/entity/entities.js';
import { loggerDefaultValue } from './logger.js';
import { nodeConfig } from './node.js';

const { db } = config;

// nullish coalescing
const database = (db?.name as string | undefined) ?? Buch.name.toLowerCase();

const host = (db?.host as string | undefined) ?? 'localhost';
const username =
    (db?.username as string | undefined) ?? Buch.name.toLowerCase();
const pass = (db?.password as string | undefined) ?? 'p';
const passAdmin = (db?.passwordAdmin as string | undefined) ?? 'p';

const namingStrategy = new SnakeNamingStrategy();

// logging durch console.log()
const logging =
    (nodeConfig.nodeEnv === 'development' || nodeConfig.nodeEnv === 'test') &&
    !loggerDefaultValue;
const logger = 'advanced-console';

// TODO records als "deeply immutable data structure" (Stage 2)
// https://github.com/tc39/proposal-record-tuple
export let typeOrmModuleOptions: TypeOrmModuleOptions;
switch (dbType) {
    case 'postgres': {
        typeOrmModuleOptions = {
            type: 'postgres',
            host,
            port: 5432,
            username,
            password: pass,
            database,
            entities,
            namingStrategy,
            logging,
            logger,
        };
        // "rest properties" ab ES 2018: https://github.com/tc39/proposal-object-rest-spread
        const { password, ...typeOrmModuleOptionsLog } = typeOrmModuleOptions;
        if (!loggerDefaultValue) {
            console.debug('typeOrmModuleOptions: %o', typeOrmModuleOptionsLog); // eslint-disable-line sonarjs/no-duplicate-string
        }
        break;
    }
    case 'mysql': {
        typeOrmModuleOptions = {
            type: 'mysql',
            host,
            port: 3306,
            username,
            password: pass,
            database,
            entities,
            namingStrategy,
            supportBigNumbers: true,
            logging,
            logger,
        };
        // "rest properties" ab ES 2018: https://github.com/tc39/proposal-object-rest-spread
        const { password, ...typeOrmModuleOptionsLog } = typeOrmModuleOptions;
        if (!loggerDefaultValue) {
            console.debug('typeOrmModuleOptions: %o', typeOrmModuleOptionsLog);
        }
        break;
    }
    // 'better-sqlite3' erfordert Python zum Uebersetzen, wenn das Docker-Image gebaut wird
    case 'sqlite': {
        typeOrmModuleOptions = {
            type: 'sqlite',
            database: `${database}.sqlite`,
            entities,
            namingStrategy,
            logging,
            logger,
        };
        if (!loggerDefaultValue) {
            console.debug('typeOrmModuleOptions: %o', typeOrmModuleOptions);
        }
        break;
    }
    default: {
        typeOrmModuleOptions = {
            type: 'postgres',
            host,
            port: 5432,
            username,
            password: pass,
            database,
            entities,
            logging,
            logger,
        };
        break;
    }
}
Object.freeze(typeOrmModuleOptions);

export const dbPopulate = db?.populate === true;
export const adminDataSourceOptions: DataSourceOptions =
    dbType === 'mysql'
        ? {
              type: 'mysql',
              host,
              port: 3306,
              username: 'root',
              password: passAdmin,
              database,
              namingStrategy,
              supportBigNumbers: true,
              logging,
              logger,
          }
        : {
              type: 'postgres',
              host,
              port: 5432,
              username: 'postgres',
              password: passAdmin,
              database,
              schema: database,
              namingStrategy,
              logging,
              logger,
          };
