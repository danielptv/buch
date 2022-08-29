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

// https://jestjs.io/docs/configuration
// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
// https://github.com/BenSjoberg/nest-esm-import-issue-example

import { type Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
    // Verzeichnis in node_modules mit einer Datei jest-preset.js
    // https://kulshekhar.github.io/ts-jest/docs/next/guides/esm-support
    // https://kulshekhar.github.io/ts-jest/docs/getting-started/presets
    // https://jestjs.io/docs/getting-started#via-ts-jest
    preset: 'ts-jest/presets/default-esm',

    extensionsToTreatAsEsm: ['.ts', '.mts', '.json'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.m?js$': '$1', // eslint-disable-line @typescript-eslint/naming-convention
    },

    transform: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '\\.test\\.m?ts$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },

    testRegex: '__tests__\\.*\\\\.*test\\.m?ts$',
    collectCoverageFrom: ['<rootDir>/src/**/*.*ts'],
    // coverageDirectory: 'coverage',
    testEnvironment: 'node',

    bail: true,
    coveragePathIgnorePatterns: [
        '<rootDir>/src/main\\.ts$',
        '.*\\.module\\.ts$',
        '<rootDir>/src/health/',
    ],
    coverageReporters: ['text-summary', 'html'],
    errorOnDeprecated: true,
    testTimeout: 10_000,
    verbose: true,
};

export default jestConfig;
