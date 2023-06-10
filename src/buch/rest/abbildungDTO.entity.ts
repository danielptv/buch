/* eslint-disable @typescript-eslint/no-magic-numbers */
/*
 * Copyright (C) 2023 - present Juergen Zimmermann, Florian Goebel, Hochschule Karlsruhe
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
 * Das Modul besteht aus der Entity-Klasse.
 * @packageDocumentation
 */

import { Length, Matches, MaxLength } from 'class-validator';

/**
 * Entity-Klasse für Abbildung ohne TypeORM.
 */
export class AbbildungDTO {
    // SHA-1 Hash
    @Length(40, 40)
    @Matches('^[a-zA-Z0-9]+$')
    readonly id!: string;

    @MaxLength(32)
    readonly beschriftung!: string;

    @MaxLength(16)
    readonly contentType!: string;
}
/* eslint-enable @typescript-eslint/no-magic-numbers */
