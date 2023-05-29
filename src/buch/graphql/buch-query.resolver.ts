// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
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
import { Args, Query, Resolver } from '@nestjs/graphql';
import { type Buch, BuchArt } from '../entity/buch.entity.js';
import {
    BuchReadService,
    Suchkriterien,
} from '../service/buch-read.service.js';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { getLogger } from '../../logger/logger.js';

export type BuchDTO = Omit<Buch, 'abbildungen' | 'aktualisiert' | 'erzeugt'>;
export interface IdInput {
    id: number;
}

@Resolver()
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class BuchQueryResolver {
    readonly #service: BuchReadService;

    readonly #logger = getLogger(BuchQueryResolver.name);

    constructor(service: BuchReadService) {
        this.#service = service;
    }

    @Query()
    async buch(@Args() idInput: IdInput) {
        const { id } = idInput;
        this.#logger.debug('findById: id=%d', id);

        const buch = await this.#service.findById({ id });
        const buchDTO = this.#toBuchDTO(buch);

        this.#logger.debug('findById: buchDTO=%o', buchDTO);
        return buchDTO;
    }

    @Query()
    async buecher(
        @Args()
        suche:
            | {
                  titel?: string;
                  rating?: number;
                  schlagwoerter?: string[];
                  art?: BuchArt;
              }
            | undefined,
    ) {
        // Abfrage nach der Buchart, weil diese nicht als Undefined-Property übergeben werden kann (sonst Problem bei der SQL-Generierung im Query Builder).
        const suchkriterien =
            suche?.art === undefined
                ? ({
                      titel: suche?.titel,
                      rating: suche?.rating,
                      schlagwoerter: suche?.schlagwoerter,
                  } as Suchkriterien)
                : {
                      titel: suche.titel,
                      rating: suche.rating,
                      schlagwoerter: suche.schlagwoerter,
                      art: suche.art,
                  } as Suchkriterien;
        this.#logger.debug('find: suchkritierien=%o', suchkriterien);

        const buecher = await this.#service.find(suchkriterien);
        const buecherDTO = buecher.map((buch) => this.#toBuchDTO(buch));

        this.#logger.debug('find: buecherDTO=%o', buecherDTO);
        return buecherDTO;
    }

    #toBuchDTO(buch: Buch): BuchDTO {
        return {
            id: buch.id,
            version: buch.version,
            isbn: buch.isbn,
            rating: buch.rating,
            art: buch.art,
            preis: buch.preis,
            rabatt: buch.rabatt,
            lieferbar: buch.lieferbar,
            datum: buch.datum,
            homepage: buch.homepage,
            schlagwoerter: buch.schlagwoerter,
            titel: buch.titel,
        };
    }
}
