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
import { Schlagwort } from '../buch/entity/schlagwort.entity.js';
import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './env.js';
import { k8sConfig } from './kubernetes.js';
import { loggerDefaultValue } from './logger.js';
import { nodeConfig } from './node.js';

const { DB_TYPE, DB_NAME, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_POPULATE } =
    env;

// nullish coalescing
const database = DB_NAME ?? Buch.name.toLowerCase();
const { detected } = k8sConfig;
const dbType =
    DB_TYPE === undefined || DB_TYPE === 'postgres' ? 'postgres' : 'mysql';
const host = detected ? dbType : DB_HOST ?? 'localhost';
const username = DB_USERNAME ?? Buch.name.toLowerCase();
const pass = DB_PASSWORD ?? 'p';

// siehe auch src\buch\buch.module.ts
const entities = [Buch, Schlagwort];

// logging durch console.log()
const logging =
    (nodeConfig.nodeEnv === 'development' || nodeConfig.nodeEnv === 'test') &&
    !loggerDefaultValue;
const logger = 'advanced-console';

// TODO records als "deeply immutable data structure" (Stage 2)
// https://github.com/tc39/proposal-record-tuple
export const typeOrmModuleOptions: TypeOrmModuleOptions =
    dbType === 'postgres'
        ? {
              type: 'postgres',
              host,
              port: 5432,
              username,
              password: pass,
              database,
              entities,
              logging,
              logger,
          }
        : {
              type: 'mysql',
              host,
              port: 3306,
              username,
              password: pass,
              database,
              entities,
              supportBigNumbers: true,
              logging,
              logger,
          };
Object.freeze(typeOrmModuleOptions);

// "rest properties" ab ES 2018: https://github.com/tc39/proposal-object-rest-spread
const { password, ...typeOrmModuleOptionsLog } = typeOrmModuleOptions;
if (!loggerDefaultValue) {
    console.debug('typeOrmModuleOptions: %o', typeOrmModuleOptionsLog);
}

export const dbPopulate = DB_POPULATE?.toLowerCase() === 'true';
