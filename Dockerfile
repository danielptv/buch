# syntax=docker/dockerfile:1.5.2

# Copyright (C) 2023 -  Juergen Zimmermann, Hochschule Karlsruhe
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

# Aufruf:   docker buildx build --tag juergenzimmermann/buch:2023.1.0 .
#           ggf. --no-cache
#           Get-Content Dockerfile | docker run --rm --interactive hadolint/hadolint:2.12.1-beta-debian

ARG NODE_VERSION=19.7.0
FROM node:${NODE_VERSION}-bullseye AS builder

WORKDIR /app

COPY package*.json .env .npmrc nest-cli.json tsconfig*.json ./
COPY src ./src

# npm ci liest "dependencies" aus package-lock.json
# ggf.: apt-get update && apt-get upgrade -y
# "here document" wie in einem Shellscipt
RUN <<EOF
set -ex
npm i -g npm
npm i -g @nestjs/cli rimraf
npm i
npm run build
EOF

CMD ["npm", "start"]

# ------------------------------------------------------------------------------
# S t a g e   2
# ------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bullseye-slim

WORKDIR /opt/app

COPY --from=builder /app/package.json /app/.env /app/.npmrc /app/nest-cli.json ./
ARG NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/buch/graphql/schema.graphql ./dist/buch/graphql/
COPY --from=builder /app/src/security/auth/login.graphql ./dist/security/auth/
COPY --from=builder /app/src/config/dev/mysql ./dist/config/dev/mysql
COPY --from=builder /app/src/config/dev/postgres ./dist/config/dev/postgres
# better-sqlite3 muss mit Python uebersetzt werden
COPY --from=builder /app/src/config/dev/sqlite ./dist/config/dev/sqlite
COPY --from=builder /app/src/config/jwt ./dist/config/jwt
COPY --from=builder /app/src/config/tls ./dist/config/tls

# https://unix.stackexchange.com/questions/217369/clear-apt-get-list
RUN set -ex \
    && apt-get update \
    && rm -rf /var/lib/apt/lists/* \
    && npm i -g npm \
    && npm i -g @nestjs/cli rimraf

RUN <<EOF
set -ex
npm i -D node-gyp
npm i --omit dev
#node-gyp rebuild
npm prune
groupadd --gid 10000 app
useradd --uid 10000 --gid app --create-home --shell /bin/bash app
chown -R app:app ./
EOF

USER app
EXPOSE 3000
CMD ["node", "dist/main.js"]
