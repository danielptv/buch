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
 * Das Modul enthält Objekte mit Daten aus Umgebungsvariablen.
 * @packageDocumentation
 */

// Umgebungsvariable durch die Konfigurationsdatei .env
// evtl. node-config
import dotenv from 'dotenv';
import type pino from 'pino';
import process from 'node:process';

// .env nur einlesen, falls nicht in Kubernetes bzw. in der Cloud
dotenv.config();

const {
    // Umgebungsvariable `NODE_ENV` als gleichnamige Konstante, die i.a. einen der
    // folgenden Werte enthält:
    // - `production`, z.B. in einer Cloud,
    // - `development` oder
    // - `test`
    NODE_ENV,
    PORT,
    BUCH_SERVICE_HOST,
    BUCH_SERVICE_PORT,
    K8S_TLS,
    DB_TYPE,
    DB_NAME,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_POPULATE,
    APOLLO_DEBUG,
    LOG_LEVEL,
    LOG_DIR,
    LOG_PRETTY,
    LOG_DEFAULT,
    HEALTH_PRETTY_PRINT,
    JWT_EXPIRES_IN,
    JWT_ISSUER,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_LOG,
    USER_PASSWORD_ENCODED,
} = process.env; // eslint-disable-line n/no-process-env

/* eslint-disable @typescript-eslint/naming-convention */
export const env = {
    // Umgebungsvariable `NODE_ENV` als gleichnamige Konstante, die i.a. einen der
    // folgenden Werte enthält:
    // - `production`, z.B. in einer Cloud,
    // - `development` oder
    // - `test`
    NODE_ENV,
    PORT,
    BUCH_SERVICE_HOST,
    BUCH_SERVICE_PORT,
    K8S_TLS,
    DB_TYPE,
    DB_NAME,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_POPULATE,
    APOLLO_DEBUG,
    LOG_LEVEL,
    LOG_DIR,
    LOG_PRETTY,
    LOG_DEFAULT,
    HEALTH_PRETTY_PRINT,
    JWT_EXPIRES_IN,
    JWT_ISSUER,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_LOG,
    USER_PASSWORD_ENCODED,
} as const;
/* eslint-enable @typescript-eslint/naming-convention */

// https://twitter.com/mattpocockuk/status/1598708710523772929
const nodeConfigEnv = {
    nodeEnv: NODE_ENV,
    port: PORT,
    serviceHost: BUCH_SERVICE_HOST,
    servicePort: BUCH_SERVICE_PORT,
} as const;

const logConfigEnv = {
    logLevel: LOG_LEVEL as pino.Level | undefined,
    logDir: LOG_DIR === undefined ? LOG_DIR : LOG_DIR.trimEnd(),
    pretty: LOG_PRETTY?.toLowerCase() === 'true',
    defaultValue: LOG_DEFAULT?.toLowerCase() === 'true',
} as const;

/**
 * Eingelesene Umgebungsvariable
 */
export const env2 = {
    nodeConfigEnv,
    logConfigEnv,
} as const;
