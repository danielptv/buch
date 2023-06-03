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
 * Das Modul enthält die Konfiguration für den Mail-Client mit _nodemailer_.
 * @packageDocumentation
 */

import { type Options } from 'nodemailer/lib/smtp-transport';
import { config } from './buch-config.js';
import { loggerDefaultValue } from './logger.js';

const { mail } = config;

const deactivated = mail?.deactivated === true;

// Hochschule Karlsruhe: smtp.h-ka.de
// nullish coalescing
const host = mail?.host as string | undefined ?? 'smtp'; // eslint-disable-line prettier/prettier
// Hochschule Karlsruhe:   25
const port = mail?.port as number | undefined ?? 25; // eslint-disable-line @typescript-eslint/no-magic-numbers, prettier/prettier
const logger = mail?.log === true;

/**
 * Konfiguration für den Mail-Client mit _nodemailer_.
 */
// TODO records als "deeply immutable data structure" (Stage 2)
// https://github.com/tc39/proposal-record-tuple
export const options: Options = {
    host,
    port,
    secure: false,

    // Googlemail:
    // service: 'gmail',
    // auth: {
    //     user: 'Meine.Benutzerkennung@gmail.com',
    //     pass: 'mypassword'
    // }

    priority: 'normal',
    logger,
} as const;
export const mailConfig = {
    deactivated,
    options,
};
Object.freeze(options);
if (!loggerDefaultValue) {
    console.debug('mailConfig: %o', mailConfig);
}
