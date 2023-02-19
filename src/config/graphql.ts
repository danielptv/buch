/*
 * Copyright (C) 2021 - present Juergen Zimmermann, Hochschule Karlsruhe
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

import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';

const SRC_PATH = 'src/';

/**
 * Das Konfigurationsobjekt für GraphQL.
 */
export const graphQlModuleOptions: ApolloDriverConfig = {
    typePaths: [
        `./${SRC_PATH}buch/graphql/schema.graphql`,
        `./${SRC_PATH}security/auth/login.graphql`,
    ],
    // alternativ: Mercurius (statt Apollo) fuer Fastify (statt Express)
    driver: ApolloDriver,
    playground: true,
    // TODO formatError und logger konfigurieren, damit UserInputError nicht in der Konsole protokolliert wird
};
