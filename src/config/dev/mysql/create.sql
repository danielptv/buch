-- Copyright (C) 2022 - present Juergen Zimmermann, Hochschule Karlsruhe
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.

-- https://dev.mysql.com/doc/refman/8.0/en/create-table.html
-- https://dev.mysql.com/doc/refman/8.0/en/data-types.html
-- https://dev.mysql.com/doc/refman/8.0/en/integer-types.html
-- BOOLEAN = TINYINT(1) mit TRUE, true, FALSE, false
-- https://dev.mysql.com/doc/refman/8.0/en/boolean-literals.html
-- https://dev.mysql.com/doc/refman/8.0/en/date-and-time-types.html
-- TIMESTAMP nur zwischen '1970-01-01 00:00:01' und '2038-01-19 03:14:07'
-- https://dev.mysql.com/doc/refman/8.0/en/date-and-time-types.html
-- https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html
-- https://dev.mysql.com/blog-archive/mysql-8-0-16-introducing-check-constraint
-- UNIQUE: impliziter Index als B+ Baum

CREATE TABLE IF NOT EXISTS buch (
    id            INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    version       INT NOT NULL DEFAULT 0,
    isbn          CHAR(17) UNIQUE NOT NULL,
    schlagwoerter VARCHAR(64),
    art           ENUM('DRUCKAUSGABE', 'KINDLE'),
    preis         DECIMAL(8,2) NOT NULL,
    rabatt        DECIMAL(4,3) NOT NULL,
    lieferbar     BOOLEAN NOT NULL DEFAULT FALSE,
    datum         DATE,
    homepage      VARCHAR(40),
    rating        VARCHAR(192),
    schlagwoerter VARCHAR(64),
    erzeugt       DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    aktualisiert  DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
) TABLESPACE buchspace ROW_FORMAT=COMPACT;
ALTER TABLE buch AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS titel (
    id          INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    titel       VARCHAR(80) NOT NULL,
    untertitel  VARCHAR(80),
    buch_id     CHAR(36) UNIQUE NOT NULL references buch(id)
) TABLESPACE buchspace ROW_FORMAT=COMPACT;
ALTER TABLE titel AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS abbildung (
    id              CHAR(40) NOT NULL PRIMARY KEY,
    beschriftung    VARCHAR(32) NOT NULL,
    content_type    VARCHAR(16) NOT NULL,
) TABLESPACE buchspace ROW_FORMAT=COMPACT;

CREATE TABLE IF NOT EXISTS buch_abbildungen (
    buch_id         integer REFERENCES buch(id),
    abbildung_id    char(40) REFERENCES abbildung(id),
    PRIMARY KEY (buch_id, abbildung_id)
) TABLESPACE buchspace;
