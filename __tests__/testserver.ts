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
import { Agent } from 'node:https';
import { AppModule } from '../src/app.module.js';
import { type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import dockerCompose from 'docker-compose';
import isPortReachable from 'is-port-reachable';
import { nodeConfig } from '../src/config/node.js';
import path from 'path';
import { paths } from '../src/config/paths.js';
import { typeOrmModuleOptions } from '../src/config/db.js';

export const loginPath = `${paths.auth}/${paths.login}`;

export const { host, port } = nodeConfig;

const { httpsOptions } = nodeConfig;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const composeService: string = (typeOrmModuleOptions as any).type;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const dbPort: number = (typeOrmModuleOptions as any).port;
// Verzeichnis mit docker-compose.yaml ausgehend vom Wurzelverzeichnis
const dockerComposeDir = path.join('extras', composeService);

let dbHealthCheck: string;
if (composeService === 'postgres') {
    dbHealthCheck = 'until pg_isready ; do sleep 1; done';
} else if (composeService === 'mysql') {
    dbHealthCheck = 'until ping ; do sleep 1; done';
} else {
    throw new Error(
        `Der DB-Container ${composeService} wird nicht unterstuetzt`,
    );
}

// -----------------------------------------------------------------------------
// D B - S e r v e r   m i t   D o c k e r   C o m p o s e
// -----------------------------------------------------------------------------
const startDbServer = async () => {
    const isDBReachable = await isPortReachable(dbPort, { host: 'localhost' });
    if (isDBReachable) {
        return;
    }

    // Container starten
    try {
        await dockerCompose.upAll({
            cwd: dockerComposeDir,
            commandOptions: [composeService],
            // Logging beim Hochfahren des DB-Containers
            log: true,
        });
    } catch (err: unknown) {
        console.error(`startDbServer: ${JSON.stringify(err)}`);
        return;
    }

    // Ist der PostgreSQL-Server im Container bereit fuer DB-Requests?
    await dockerCompose.exec(composeService, ['sh', '-c', dbHealthCheck], {
        cwd: dockerComposeDir,
    });
};

const shutdownDbServer = async () => {
    await dockerCompose.down({
        cwd: dockerComposeDir,
        log: true,
    });
};

// -----------------------------------------------------------------------------
// T e s t s e r v e r   m i t   H T T P S
// -----------------------------------------------------------------------------
let server: INestApplication;

export const startServer = async () => {
    if (httpsOptions === undefined) {
        throw new Error('HTTPS wird nicht konfiguriert.');
    }

    await startDbServer();
    server = await NestFactory.create(AppModule, {
        httpsOptions,
        logger: ['log'],
        // logger: ['debug'],
    });
    await server.listen(port);
    return server;
};

export const shutdownServer = async () => {
    try {
        await server.close();
    } catch {
        console.warn('Der Server wurde fehlerhaft beendet.');
    }
    await shutdownDbServer();
};

// fuer selbst-signierte Zertifikate
export const httpsAgent = new Agent({
    requestCert: true,
    rejectUnauthorized: false,
    ca: httpsOptions?.cert as Buffer,
});
