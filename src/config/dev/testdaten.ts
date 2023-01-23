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
import { type Buch } from '../../buch/entity/buch.entity.js';

// TypeORM kann keine SQL-Skripte ausfuehren

export const buecher: Buch[] = [
    // -------------------------------------------------------------------------
    // L e s e n
    // -------------------------------------------------------------------------
    {
        id: '00000000-0000-0000-0000-000000000001',
        version: 0,
        titel: 'Alpha',
        rating: 4,
        art: 'DRUCKAUSGABE',
        verlag: 'FOO_VERLAG',
        preis: 11.1,
        rabatt: 0.011,
        lieferbar: true,
        datum: new Date('2022-02-01'),
        // "Konzeption und Realisierung eines aktiven Datenbanksystems"
        isbn: '978-3-897-22583-1',
        homepage: 'https://acme.at',
        schlagwoerter: ['JAVASCRIPT'],
        erzeugt: new Date('2022-02-01'),
        aktualisiert: new Date('2022-02-01'),
    },
    {
        id: '00000000-0000-0000-0000-000000000002',
        version: 0,
        titel: 'Beta',
        rating: 2,
        art: 'KINDLE',
        verlag: 'BAR_VERLAG',
        preis: 22.2,
        rabatt: 0.022,
        lieferbar: true,
        datum: new Date('2022-02-02'),
        // "Verteilte Komponenten und Datenbankanbindung"
        isbn: '978-3-827-31552-6',
        homepage: 'https://acme.biz',
        schlagwoerter: ['TYPESCRIPT'],
        erzeugt: new Date('2022-02-02'),
        aktualisiert: new Date('2022-02-02'),
    },
    {
        id: '00000000-0000-0000-0000-000000000003',
        version: 0,
        titel: 'Gamma',
        rating: 3,
        art: 'DRUCKAUSGABE',
        verlag: 'FOO_VERLAG',
        preis: 33.3,
        rabatt: 0.033,
        lieferbar: true,
        datum: new Date('2022-02-03'),
        // "Design Patterns"
        isbn: '978-0-201-63361-0',
        homepage: 'https://acme.com',
        schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
        erzeugt: new Date('2022-02-03'),
        aktualisiert: new Date('2022-02-03'),
    },
    // -------------------------------------------------------------------------
    // A e n d e r n
    // -------------------------------------------------------------------------
    {
        id: '00000000-0000-0000-0000-000000000040',
        version: 0,
        titel: 'Delta',
        rating: 4,
        art: 'DRUCKAUSGABE',
        verlag: 'BAR_VERLAG',
        preis: 44.4,
        rabatt: 0.044,
        lieferbar: true,
        datum: new Date('2022-02-04'),
        // "Freiburger Chorbuch"
        isbn: '978-0-007-09732-6',
        homepage: 'https://acme.de',
        schlagwoerter: undefined,
        erzeugt: new Date('2022-02-04'),
        aktualisiert: new Date('2022-02-04'),
    },
    // -------------------------------------------------------------------------
    // L o e s c h e n
    // -------------------------------------------------------------------------
    {
        id: '00000000-0000-0000-0000-000000000050',
        version: 0,
        titel: 'Epsilon',
        rating: 2,
        art: 'KINDLE',
        verlag: 'FOO_VERLAG',
        preis: 55.5,
        rabatt: 0.055,
        lieferbar: true,
        datum: new Date('2022-02-05'),
        // "Maschinelle Lernverfahren zur Behandlung von Bonitätsrisiken im Mobilfunkgeschäft"
        isbn: '978-3-824-40481-0',
        homepage: 'https://acme.es',
        schlagwoerter: ['TYPESCRIPT'],
        erzeugt: new Date('2022-02-05'),
        aktualisiert: new Date('2022-02-05'),
    },
    {
        id: '00000000-0000-0000-0000-000000000060',
        version: 0,
        titel: 'Phi',
        rating: 2,
        art: 'KINDLE',
        verlag: 'FOO_VERLAG',
        preis: 66.6,
        rabatt: 0.066,
        lieferbar: true,
        datum: new Date('2022-02-06'),
        // "Software pioneers",
        isbn: '978-3-540-43081-0',
        homepage: 'https://acme.it',
        schlagwoerter: ['TYPESCRIPT'],
        erzeugt: new Date('2022-02-06'),
        aktualisiert: new Date('2022-02-06'),
    },
];
