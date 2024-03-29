/*
 * Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
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
 * Das Modul enthält die Konfiguration für den _Node_-basierten Server.
 * @packageDocumentation
 */

import { existsSync, readFileSync } from 'node:fs';
import { type HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface.js';
import { cloud } from './cloud.js';
import { config } from './buch-config.js';
import { env } from './env.js';
import { hostname } from 'node:os';
import { resolve } from 'node:path';

const { LOG_DEFAULT, NODE_ENV } = env;

const computername = hostname();
const port = (config.node?.port as number | undefined) ?? 3000; // eslint-disable-line @typescript-eslint/no-magic-numbers

// https://nodejs.org/api/fs.html
// https://nodejs.org/api/path.html
// http://2ality.com/2017/11/import-meta.html
const usePKI = cloud === undefined;

// fuer z.B. PEM-Dateien fuer TLS
const srcDir = existsSync('src') ? 'src' : 'dist';

// fuer public/private keys: TLS und JWT
export const configDir = resolve(srcDir, 'config');
const tlsDir = resolve(configDir, 'tls');

const key = usePKI
    ? readFileSync(resolve(tlsDir, 'private-key.pem')) // eslint-disable-line security/detect-non-literal-fs-filename
    : undefined;
const cert = usePKI
    ? readFileSync(resolve(tlsDir, 'certificate.cer')) // eslint-disable-line security/detect-non-literal-fs-filename
    : undefined;

let httpsOptions: HttpsOptions | undefined;
if (cloud === undefined) {
    if (LOG_DEFAULT?.toLowerCase() !== 'true' && config.log?.default !== true) {
        console.debug('HTTPS');
    }
    if (key === undefined || cert === undefined) {
        console.warn('Key und/oder Zertifikat fehlen');
    } else {
        httpsOptions = {
            // Shorthand Properties:   key: key
            key,
            cert,
        };
    }
}

/**
 * Die Konfiguration für den _Node_-basierten Server:
 * - Rechnername
 * - IP-Adresse
 * - Port
 * - `PEM`- und Zertifikat-Datei mit dem öffentlichen und privaten Schlüssel
 *   für TLS
 */
// "as const" fuer readonly
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
// TODO records als "deeply immutable data structure" (Stage 2)
// https://github.com/tc39/proposal-record-tuple
export const nodeConfig = {
    // Shorthand Property ab ES 2015
    host: computername,
    port,
    configDir,
    httpsOptions,
    nodeEnv: NODE_ENV as
        | 'development'
        | 'PRODUCTION'
        | 'production'
        | 'test'
        | undefined,
} as const;
