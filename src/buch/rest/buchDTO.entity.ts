/* eslint-disable @typescript-eslint/no-magic-numbers */
/*
 * Copyright (C) 2016 - present Juergen Zimmermann, Florian Goebel, Hochschule Karlsruhe
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

// eslint-disable-next-line max-classes-per-file
import {
    ArrayUnique,
    IsBoolean,
    IsISBN,
    IsISO8601,
    IsInt,
    IsOptional,
    IsPositive,
    IsUrl,
    Matches,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { BuchArt, Verlag } from '../entity/buch.entity.js';
import { ApiProperty } from '@nestjs/swagger';

export const MAX_RATING = 5;

/**
 * Entity-Klasse für Bücher ohne Schlagwoerter.
 */
export class BuchOhneSchlagwoerterDTO {
    @Matches('^\\w.*')
    @MaxLength(40)
    @ApiProperty({ example: 'Der Titel', type: String })
    readonly titel!: string; //NOSONAR

    @IsInt()
    @Min(0)
    @Max(MAX_RATING)
    @ApiProperty({ example: 5, type: Number })
    readonly rating: number | undefined;

    @Matches(/^DRUCKAUSGABE$|^KINDLE$/u)
    @IsOptional()
    @ApiProperty({ example: 'DRUCKAUSGABE', type: String })
    readonly art: BuchArt | undefined;

    @Matches(/^BAR_VERLAG$|^FOO_VERLAG$/u)
    @ApiProperty({ example: 'FOO_VERLAG', type: String })
    readonly verlag!: Verlag;

    @IsPositive()
    @ApiProperty({ example: 1, type: Number })
    // statt number ggf. Decimal aus decimal.js analog zu BigDecimal von Java
    readonly preis!: number;

    @Min(0)
    @Max(1)
    @IsOptional()
    @ApiProperty({ example: 0.1, type: Number })
    readonly rabatt: number | undefined;

    @IsBoolean()
    @ApiProperty({ example: true, type: Boolean })
    readonly lieferbar: boolean | undefined;

    @IsISO8601({ strict: true })
    @IsOptional()
    @ApiProperty({ example: '2021-01-31' })
    readonly datum: Date | string | undefined;

    // https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
    @IsISBN(13)
    @ApiProperty({ example: '0-007-00644-6', type: String })
    readonly isbn!: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ example: 'https://test.de/', type: String })
    readonly homepage: string | undefined;
}

/**
 * Entity-Klasse für Bücher ohne Schlagwoerter.
 */
export class BuchDTO extends BuchOhneSchlagwoerterDTO {
    @IsOptional()
    @ArrayUnique()
    @ApiProperty({ example: ['JAVASCRIPT', 'TYPESCRIPT'] })
    readonly schlagwoerter: string[] | undefined;
}
/* eslint-enable @typescript-eslint/no-magic-numbers */
