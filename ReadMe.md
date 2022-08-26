# Hinweise zum Programmierbeispiel

<!--
  Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

[Juergen Zimmermann](mailto:Juergen.Zimmermann@h-ka.de)

> Diese Datei ist in Markdown geschrieben und kann mit `<Strg><Shift>v` in
> Visual Studio Code leicht gelesen werden. Dazu wird die Extension
> _Markdown Preview Mermaid Support_ empfohlen, um UML-Diagramme in der Syntax
> von _Mermaid_ (wie bei PlantUML) visualisieren zu können.
>
> Näheres zu Markdown gibt es z.B. bei [Markdown Guide](https://www.markdownguide.org/)
>
> Nur in den ersten beiden Vorlesungswochen kann es Unterstützung bei
> Installationsproblemen geben.

## Inhalt

- [Download- und ggf. Upload-Geschwindigkeit](#download--und-ggf-upload-geschwindigkeit)
- [Vorbereitung der Installation](#vorbereitung-der-installation)
- [ESM = ES Modules](#esm-=-es-modules)
- [Eigener Namespace in Kubernetes](#eigener-namespace-in-kubernetes)
- [Relationale Datenbanksysteme](#relationale-datenbanksysteme)
  - [PostgreSQL](#postgresql)
  - [MySQL](#mySQL)
- [Administration des Kubernetes-Clusters](#administration-des-kubernetes-clusters)
- [Node Best Practices](#node-best-practices)
- [Lokaler Appserver (mit Nest)](#lokaler-appserver-mit-nest)
  - [Entwicklung in einer Powershell](#entwicklung-in-einer-powershell)
  - [OpenAPI](#openAPI)
  - [Apollo Sandbox](#apollo-sandbox)
  - [REST Client für eine REST- und eine GraphQL-Schnittstelle](#rEST-client-für-eine-rEST--und-eine-graphQL-schnittstelle)
  - [Postman](#postman)
- [Tests aufrufen](#tests-aufrufen)
- [Deployment in Kubernetes](#deployment-in-kubernetes)
  - [DB-Server als Voraussetzung](#db-server-als-voraussetzung)
  - [Docker-Image durch Buildpacks](#docker-image-durch-buildpacks)
  - [Deployment mit kubectl und Kustomize](#deployment-mit-kubectl-und-kustomize)
- [Statische Codeanalyse](#statische-codeanalyse)
  - [ESLint](#eslint)
  - [SonarQube](#sonarQube)
  - [type-coverage](#type-coverage)
- [Sicherheitsanalyse durch snyk](#sicherheitsanalyse-durch-snyk)
- [AsciiDoctor und PlantUML](#asciidoctor-und-plantuml)
  - [Preview von PlantUML-Dateien](#preview-von-plantuml-dateien)
  - [Einstellungen für Preview von AsciiDoctor-Dateien](#einstellungen-für-preview-von-asciidoctor-dateien)
  - [Preview von AsciiDoctor-Dateien](#preview-von-asciidoctor-dateien)
  - [Dokumentation im Format HTML](#dokumentation-im-format-html)
- [Continuous Integration mit Jenkins](#continuous-integration-mit-jenkins)
  - [Aufruf mit Webbrowser](#aufruf-mit-webbrowser)
  - [Bash zur evtl. Fehlersuche im laufenden Jenkins-Container](#bash-zur-evtl-fehlersuche-im-laufenden-jenkins-container)
- [Monitoring durch clinic](#monitoring-durch-clinic)
- [Visual Studio Code](#visual-studio-code)
- [Heroku](#heroku)
  - [Heroku von Salesforce](#heroku-von-salesforce)
  - [dyno, slug und buildpack](#dyno,-slug-und-buildpack)
  - [Registrierung bei Heroku](#registrierung-bei-heroku)
  - [Einmalig: Git-Repository erstellen](#einmalig:-git-repository-erstellen)
  - [Einloggen und Token erstellen mit der Heroku CLI](#einloggen-und-token-erstellen-mit-der-heroku-cli)
  - [Leere Anwendung für Heroku erstellen](#leere-anwendung-für-heroku-erstellen)
  - [Add-on für PostgreSQL](#add-on-für-postgresql)
  - [Umgebungsvariable für Heroku](#umgebungsvariable-für-heroku)
  - [Deployment für Heroku](#deployment-für-heroku)
  - [Status-Informationen zu Heroku](#status-informationen-zu-heroku)
  - [Verfügbarkeit der eigenen Heroku-Anwendung](#verfügbarkeit-der-eigenen-heroku-anwendung)
  - [Heroku-Console](#heroku-console)
  - [Dashboard für die Verwaltung der eigenen Heroku-Anwendung(en)](#dashboard-für-die-verwaltung-der-eigenen-heroku-anwendungen)
  - [pgadmin für PostgreSQL](#pgadmin-für-postgresql)
  - [Sonstige Heroku-Kommandos](#sonstige-heroku-kommandos)
- [Empfohlene Code-Konventionen](#empfohlene-code-konventionen)

---

## Download- und ggf. Upload Geschwindigkeit

In einem Webbrowser kann man z.B. mit der URL `https://speed.cloudflare.com` die
Download- und die Upload-Geschwindigkeit testen.

Alternativ kann man durch das Kommando `fast` in einer Powershell die aktuelle
Download-Geschwindigkeit ermitteln.

Mit der zusätzlichen Option `--upload` kann zusätzlich die aktuelle
Upload-Geschwindigkeit ermittelt werden.

---

## Vorbereitung der Installation

- Das Beispiel _nicht_ in einem Pfad mit _Leerzeichen_ installieren.
  Viele Javascript-Bibliotheken werden unter Linux entwickelt und dort benutzt
  man **keine** Leerzeichen in Pfaden. Ebenso würde ich das Beispiel nicht auf
  dem  _Desktop_ auspacken bzw. installieren.

- Bei [GitHub](https://github.com) oder [GitLab](https://gitlab.com)
  registrieren, falls man dort noch nicht registriert ist.

---

## ESM = ES Modules

ESM ist die gängige Abkürzung für _ES Modules_, so dass man `import` und
`export` statt `require()` aus _CommonJS_ verwenden kann. Die Unterstützung von
ESM wurde in Node ab Version 12 begonnen. Außerdem ist es wichtig, das man beim
Umstieg auf ESM auch die Unterstützung in _ts-node_ und _ts-jest_ beachtet.

Wenn man ESM verwendet, muss man die eigenen Module z.B. folgendermaßen
importieren:

```JavaScript
    import { myFunc } from './foo.js';
    import { myClass } from './bar/index.js';
```

Außerdem gibt es ab Node 17.1 das _Node Protocol_ für den Import von
_Builtin Modules_, z.B.:

```JavaScript
    import { resolve } from 'node:path';
```

Gute Literatur zu ESM gibt es bei:

- https://nodejs.org/api/esm.html#esm_node_imports
- https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
- https://docs.joshuatz.com/cheatsheets/node-and-npm/node-esm
- https://www.typescriptlang.org/docs/handbook/esm-node.html
- https://github.com/TypeStrong/ts-node/issues/1007

Unterstützung für ESM ist notwendig in:

- Node
- TypeScript
- ts-node
- ts-jest: versteht noch nicht die Datei-Endung `.mts` und beim Import `.mjs`
- VS Code
- Heroku mit Cloud Native Buildpacks
- Node innerhalb von Jenkins

## Eigener Namespace in Kubernetes

Ein neuer Namespace, z.B. `acme`, wird durch folgendes Kommando zusammen
mit einer _Network Policy_ für ein- und ausgehende Requests angelegt:

```powershell
    cd extras\kubernetes\default

    kubectl create namespace acme
    kubectl label --overwrite ns acme `
        pod-security.kubernetes.io/audit=baseline pod-security.kubernetes.io/audit-version=latest `
        pod-security.kubernetes.io/warn=baseline pod-security.kubernetes.io/warn-version=latest

    kubectl apply -f limit-range.yaml
    kubectl apply -f network-policy.yaml
    kubectl apply -f resource-quota.yaml
    kubectl describe namespace acme

    kubectl replace -f service-account.yaml
```

---

## Relationale Datenbanksysteme

### PostgreSQL

#### Docker Compose für PostgreSQL und pgadmin

Wenn man den eigenen Microservice direkt mit Windows laufen lässt, kann man
PostgreSQL und das Administrationswerkzeug pgadmin einfach mit _Docker Compose_
starten und später auch herunterfahren.

> ❗ Vor dem 1. Start von PostgreSQL muss man in `docker-compose.yaml` im
> Verzeichnis extras\postgres die Zeile mit dem (eingeschränkten) Linux-User
> "postgres:postgres" auskommentieren, damit die Initialisierung von PostgreSQL
> als Linux-User `root` ausgeführt werden kann. Danach kopiert man die Skripte
> `create-db-buch.sh` und `create-db-buch.sql` aus dem Verzeichnis
> `extras\postgres\scripts` nach `C:\Zimmermann\volumes\postgres\scripts`.
> Für die Windows-Verzeichnisse `C:\Zimmermann\volumes\postgres\data`,
> `C:\Zimmermann\volumes\postgres\tablespace` und
> `C:\Zimmermann\volumes\postgres\tablespace\buch` muss außerdem Vollzugriff
> gewährt werden, was über das Kontextmenü mit _Eigenschaften_ und den
> Karteireiter _Sicherheit_ für die Windows-Gruppe _Benutzer_ eingerichtet
> werden kann. Nun kann man das Auskommentieren des eingeschränkten Linux-Users
> in `docker-compose.yaml` wieder rückgängig machen, damit der DB-Server fortan
> nicht als Superuser "root" läuft.
> Übrigens ist das Emoji für das Ausrufezeichen von https://emojipedia.org.

```powershell
    cd extras\postgres
    docker compose up

    # Herunterfahren in einer 2. Shell:
    cd extras\postgres
    docker compose down
```

Der Name des Docker-Containers lautet `postgres` und ebenso lautet der
_virtuelle Rechnername_ `postgres`. Der virtuelle Rechnername `postgres`
wird später auch als Service-Name für PostgreSQL in Kubernetes verwendet.

> ❗ Nach dem 1. Start des PostgreSQL-Servers muss man einmalig den
> Datenbank-User `buch` und dessen Datenbank `buch` anlegen, d.h. der neue
> Datenbank-User `buch` wird zum Owner der Datenbank `buch`. Dazu muss man
> sich mit dem Docker-Container mit Namen `postgres` verbinden und im
> Docker-Container das `bash`-Skript ausführen:

```powershell
    docker compose exec postgres bash /scripts/create-db-buch.sh
```

Außerdem kann _pgadmin_ zur Administration verwendet werden. pgadmin läuft
ebenfalls als Docker-Container und ist über ein virtuelles Netzwerk mit dem
Docker-Container des DB-Servers verbunden. Deshalb muss beim Verbinden mit dem
DB-Server auch der virtuelle Rechnername `postgres` verwendet werden. Man ruft
also pgadmin mit Chrome und der URL `http://localhost:8888` auf.
Die Emailadresse `pgadmin@acme.com` und das Passwort `p` sind voreingestellt.
Da pgadmin mit Chromium implementiert ist, empfiehlt es sich, Chrome als
Webbrowser zu verwenden.

Beim 1. Einloggen konfiguriert man einen Server-Eintrag mit z.B. dem Namen
`postgres-container` und verwendet folgende Werte:

- Host: `postgres` (virtueller Rechnername des DB-Servers im Docker-Netzwerk.
  **BEACHTE**: `localhost` ist im virtuellen Netzwerk der Name des
  pgadmin-Containers selbst !!!)
- Port: `5432` (Defaultwert)
- Username: `postgres` (Superuser beim DB-Server)
- Password: `p`

Es empfiehlt sich, das Passwort abzuspeichern, damit man es künftig nicht jedes
Mal beim Einloggen eingeben muss.

#### Skaffold für PostgreSQL und pgadmin

Wenn der eigene Server in Kubernetes gestartet werden soll (s.u.), muss
_PostgreSQL_ zuvor in Kubernetes gestartet werden, was mit _Skaffold_ gemacht
werden kann. Wenn die Umgebungsvariable `SKAFFOLD_PROFILE` auf den Wert `dev`
gesetzt ist, dann wird das Profile `dev` verwendet, welches bei Helm zusätzlich
die Datei `dev.yaml` verwendet. Bis das Port-Forwarding aktiviert ist, das in
`skaffold.yaml` konfiguriert ist, muss man ein bisschen warten.

```powershell
    cd extras\postgres\kubernete
    skaffold dev --no-prune=false --cache-artifacts=false

    # Skaffold mit Helm statt Kustomize
    cd extras\db\postgres\helm
    skaffold dev --no-prune=false --cache-artifacts=false
```

Dabei wurde auch das Administrationswerkzeug _pgadmin_ innerhalb von Kubernetes
gestartet und kann wegen Port-Forwarding mit `http://localhost:8888` aufgerufen
werden.

Mit `<Strg>C` kann das Deployment wieder zurückgerollt werden. Ohne die beiden
Optionen muss man noch manuell die 4 _PersistentVolumeClaim_ mit den Namen
`postgres-data-volume-postgres-0`, `postgres-conf-volume-postgres-0`,
`pgadmin-pgadmin-volume-pgadmin-0` und `pgadmin-pgadmin4-volume-pgadmin-0`
löschen, die durch die _StatefulSet_ `postgres` und `pgadmin` erstellt wurden.
Dazu gibt es das PowerShell-Skript `delete-pvc.ps1` im Verzeichnis
`extras\postgres\kubernetes\scripts`.

#### helmfile für PostgreSQL und pgadmin

Statt _Skaffold_ kann man auch _helmfile_ mit manuellem Port-Forwarding verwenden:

```powershell
    cd extras\postgres\kubernetes
    helmfile apply
    .\scripts\port-forward.ps1

    # Deinstallieren
    helmfile destroy
    .\scripts\delete-pvc.ps1
```

### MySQL

#### Docker Compose für MySQL und phpMyAdmin

Wenn man den eigenen Microservice direkt mit Windows - nicht mit Kubernetes -
laufen lässt, kann man MySQL und das Administrationswerkzeug phpMyAdmin einfach
mit _Docker Compose_ starten und später auch herunterfahren.

> ❗ Vor dem 1. Start von MySQL muss man die Skripte `create-db-buch.sh` und
> `create-db-buch.sql` aus dem Projektverzeichnis
> `extras\mysql\scripts` nach `C:\Zimmermann\volumes\mysql\scripts` kopieren.

```powershell
    cd extras\mysql
    docker compose up

    # Herunterfahren in einer 2. Shell:
    cd extras\mysql
    docker compose down
```

Der Name des Docker-Containers und des _virtuellen Rechners_ lautet `mysql`.
Der virtuelle Rechnername wird später auch als Service-Name für MySQL in
Kubernetes verwendet.

> ❗ Nach dem 1. Start des DB-Servers muss man einmalig den Datenbank-User
> `buch` und dessen Datenbank `buch` anlegen, d.h. der neue Datenbank-User
> `buch` wird zum Owner der Datenbank `buch`. Dazu muss man sich mit dem
> Docker-Container mit Namen `mysql` verbinden und im Docker-Container das
> `bash`-Skript ausführen:

```powershell
    docker compose exec mysql bash /scripts/create-db-buch.sh
```

Jetzt läuft der DB-Server. Außerdem kann _phpMyAdmin_ zur Administration
verwendet werden. phpMyAdmin läuft ebenfalls als Docker-Container und ist über
ein virtuelles Netzwerk mit dem Docker-Container des DB-Servers verbunden.
Deshalb muss beim Verbinden mit dem DB-Server auch der virtuelle Rechnername
`mysql` verwendet werden. Man ruft also phpMyAdmin mit einem Webbrowser und der
URL `http://localhost:8889` auf. Zum Einloggen verwendet folgende Werte:

- Server: `mysql` (virtueller Rechnername des DB-Servers im Docker-Netzwerk.
  **BEACHTE**: `localhost` ist im virtuellen Netzwerk der Name des
  phpMyAdmin-Containers selbst !!!)
- Benutzername: `root` (Superuser beim DB-Server)
- Password: `p`

#### Skaffold für MySQL und phpMyAdmin

Wenn der eigene Server in Kubernetes gestartet werden soll (s.u.), muss
_MySQL_ zuvor in Kubernetes gestartet werden, was mit _Skaffold_ gemacht werden
kann. Wenn die Umgebungsvariable `SKAFFOLD_PROFILE` auf den Wert `dev`
gesetzt ist, dann wird das Profile `dev` verwendet, welches bei Helm zusätzlich
die Datei `dev.yaml` verwendet. Bis das Port-Forwarding aktiviert ist, das in
`skaffold.yaml` konfiguriert ist, muss man ein bisschen warten.

```powershell
    cd extras\mysql\kubernetes
    skaffold dev --no-prune=false --cache-artifacts=false
```

Dabei wurde auch das Administrationswerkzeug _phpMyAdmin_ innerhalb von Kubernetes
gestartet und kann wegen Port-Forwarding mit `http://localhost:8889` aufgerufen
werden.

Mit `<Strg>C` kann das Deployment wieder zurückgerollt werden. Ohne die beiden
Optionen muss man noch manuell das _PersistentVolumeClaim_ mit den Namen
`mysql-db-volume-mysql-0` löschen, das durch das _StatefulSet_ `mysql` erstellt
wurde. Dazu gibt es das PowerShell-Skript `delete-pvc.ps1` im Verzeichnis
`extras\mysql\kubernetes\scripts`.

#### helmfile für MySQL und phpMyAdmin

Statt _Skaffold_ kann man auch _helmfile_ mit manuellem Port-Forwarding verwenden:

```powershell
    cd extras\mysql\kubernetes
    helmfile apply
    .\scripts\port-forward.ps1

    # Deinstallieren
    helmfile destroy
    .\scripts\delete-pvc.ps1
```

## Administration des Kubernetes-Clusters

Zur Administration des Kubernetes-Clusters ist für Entwickler*innen m.E. _Lens_
von Mirantis oder _Octant_ von VMware Tanzu oder _Kui_ von IBM gut geeignet.

---

## Node Best Practices

Sehr empfehlenswert ist https://github.com/goldbergyoni/nodebestpractices

---

## Lokaler Appserver (mit Nest)

### Entwicklung in einer Powershell

Durch `npm run start:dev` wird der Appserver im _Watch_-Modus für die
Entwicklung gestartet, d.h. bei Code-Änderungen wird der Server automatisch
neu gestartet.

Beim Starten des Appservers wird außerdem mit _TypeORM_ auf die Datenbank
zugegriffen. Der Benutzername und das Passwort sind in der Datei
`src\config\db.ts` auf `admin` und `p` voreingestellt. Bei Kubernetes muss
_Port-Forwarding_ (s.o.) aktiviert sein. Dazu muss die Umgebungsvariable
`DB_HOST` in `.env` auskommentiert sein oder auf den Defaultwert `localhost`
gesetzt sein. Durch die Umgebungsvariable `DB_POPULATE` wird festgelegt, ob die
(Test-) DB `acme` neu geladen wird.

Wenn man PostgreSQL mit _Heroku_ (s.u.) statt der lokalen Kubernetes- bzw.
Docker-Installation benutzen möchte, muss man in der Datei `.env` die
Konfigurationsdaten für Heroku eintragen und die jeweiligen Kommentare entfernen.
Es ist empfehlenswert, zuerst das Beispiel mit einer lokalen
DB-Installation zum Laufen zu bringen, um die Fehlerquellen zu reduzieren.

### OpenAPI

Duch Decorators `@Api...()` kann man _OpenAPI_ (früher: Swagger) in den
Controller-Klassen und -Methoden konfigurieren und dann in einem Webbrowser mit
`https://localhost:3000/swagger` aufrufen. Die _Swagger JSON Datei_ kann man mit
`https://localhost:3000/swagger-json` aufrufen.

### Apollo Sandbox

Ab _Apollo 3_, das auch intern in Nest verwendet wird, gibt es _Apollo Sandbox_,
das man z.B. mit Chrome nutzen kann. Dabei empfiehlt es sich die
Chrome-Erweiterung _Apollo Client DevTools_ von
https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm
zu installieren. Apollo Sandbox kann man dann mit der URL
`https://studio.apollographql.com/sandbox/explorer` aufrufen.

Um effizient mit Apollo Sandbox zu arbeiten, empfiehlt es sich, dass man sich
dort registriert, damit man z.B. Autovervollständigen nutzen kann. Für das
Programmierbeispiel kann man beim Registrieren z.B. folgende Daten eingegeben:

- _Graph title_: `Buch`
- _Graph type_: `Development` angeklickt
- _Endpoint_: https://localhost:3000/graphql

Abschließend klickt man dann den Button _Create Graph_ an.

Beispielhafte _Queries_ und _Mutations_ für GraphQL gibt es in den Dateien
`extras\restclient\graphql\buch.query.http` und
`extras\restclient\graphql\buch.mutation.http`.

In der Sandbox kann man z.B. folgende Query absetzen:

...
{
  buch(id: "000000000000000000000001") {
    titel
    art
    isbn
    version
  }
}
...

Oder unter Verwendung von einer Variablen (hier: `buchId`):

...
query ($buchId: ID!) {
  buch(id: $buchId) {
    titel
    art
    isbn
    version
  }
}
...

Dazu muss man im unteren Abschnitt _Variables_ folgendes eintragen:

...
{
  "buchId": "000000000000000000000001"
}
...

Außerdem bietet Nest für eine GraphQL-Schnittstelle in einem Webbrowser die URL
`https://localhost:3000/graphql` an, mit der man auf _Playground_ zugreifen kann,
der allerdings ab _Apollo 3_ deprecated ist.

### REST Client für eine REST- und eine GraphQL-Schnittstelle

Im Unterverzeichnis `extras\restclient` befinden sich in den Unterverzeichnissen
`rest` und `graphql` mehrere Dateien mit der Extension `.rest` oder `.http`.
In diesen Dateien sind Interaktionsmöglichkeiten für die REST- und die
GraphQL-Schnittstelle.

Wenn man eine dieser Dateien in VS Code öffnet, dann sieht man bei jedem
Beispiel bzw. Abschnitt, der mit `###` beginnt, eine künstliche Zeile mit
_Send Request_ (keine Zeilennummer!). Auf _Send Request_ kann man klicken und
der Request wird ausgeführt, wozu natürlich der Server erfolgreich gestartet
sein sollte.

Für den REST-Client benötigt man unterschiedliche Umgebungen (_Environment_) je
nachdem, ob der Server lokal oder in einem (lokalen) Kubernetes-Cluster oder in
der Heroku-Cloud läuft. Verschiedene Umgebungen können prinzipiell die gleichen
Eigenschaften, aber mit verschiedenen Werten haben. Beispielsweise lautet die
URL für die REST-Schnittstelle beim lokalen Server `https://localhost:3000/...`
aber im Kubernetes-Cluster `http://localhost:3000/...`. Dazu kann man im
Unterverzeichnis `.vscode` die Datei `settings.json` bearbeiten.

Wenn man von nun an eine `.rest`-Datei öffnet, dann sieht man rechts unten in
der Statusleiste die aktuelle Umgebung. Sobald man rechts unten auf den Namen
der aktuellen Umgebung (oder _No Environment_) klickt, erscheinen die möglichen
Umgebungen in der Auswahl am oberen Fensterrand.

Wenn für die Interaktion mit dem Server Zugriffsberechtigungen erforderlich sind,
muss man sich zunächst einloggen und erhält dabei einen (Access-) Token, und
zwar einen _JWT_ (= JSON Web Token), so dass "stateless sessions" möglich sind.
Nach dem Einloggen kann man den JWT wiederholt verwenden, ohne jedes Mal den
Benutzernamen und vor allem das Passwort mitschicken zu müssen - bis zum
Ablaufen des Tokens. In der _Payload_ ("Nutzdaten") eines Tokens (siehe
https://jwt.io) sind Informationen zum jeweiligen User, so dass dessen Rollen
ermittelt werden können, um damit auf der Serverseite die Zugriffsberechtigungen
anhand der Rollen zu ermitteln (_RBAC_ = "Role-Based Access Controll").

<!-- https://github.com/kamiazya/typedoc-plugin-mermaid/issues/616 -->

```mermaid
stateDiagram
  state Gast
  state "JWT = JSON Web Token" as jwt
  state "REST-Schnittstelle" as rest
  state "GraphQL-Schnittstelle" as graphql
  state "RBAC = Role-Based Access Control" as rbac


  [*] --> Gast
  Gast --> jwt : Login, z.B. application/x-www-form-urlencoded
  jwt --> rest : HTTP-Header "Authorization"
  jwt --> graphql : HTTP-Header "Authorization"

  rest --> rbac : Authorisierung
  graphql --> rbac : Authorisierung

```

Für die Query-Sprache von GraphQL bietet der REST Client allerdings **KEIN**
Autovervollständigen an, wie man es von _Apollo Sandbox_ und _Playground_ (s.o.)
gewohnt ist.

### Postman

Als Alternative zu _REST Client_ als Plugin für VS Code kann man auch die
Desktop-Applikation _Postman_ nutzen: https://www.postman.com.

---

## Tests aufrufen

Folgende Voraussetzungen müssen oder sollten erfüllt sein:

- Der DB-Server (lokal oder bei Heroku) muss gestartet sein.
- Port-Forwarding muss für den DB-Server aktiviert sein, z.B. durch `skaffold dev`.
- Der Appserver muss _nicht gestartet_ sein.
- In `.env` kann man die Umgebungsvariable `LOG_DEFAULT` auf `true` setzen,
  um nicht zu detailliert zu protokollieren bzw. damit die Log-Ausgabe
  übersichtlich bleibt.

Nun kann man die Tests folgendermaßen in einer Powershell aufrufen:

```powershell
    npm t
```

Bei der Fehlersuche ist es ratsam, nur eine einzelnen Testdatei aufzurufen,
z.B.:

```powershell
    npm exec jest --detectOpenHandles --errorOnDeprecated `
      --forceExit --runTestsByPath '__tests__\buch\buch-get.controller.test.ts'
```

---

## Deployment in Kubernetes

### DB-Server als Voraussetzung

Voraussetzung für das Deployment des Microservice ist, dass der DB-Server
erfolgreich gestartet ist (s.o.).

### Docker-Image durch Buildpacks

Mittels _(Cloud Native) Buildpacks_ und der Konfigurationsdatei `project.toml`
kann man ein Docker Image erstellen, ohne dass ein Dockerfile erforderlich ist.
Das resultierende Image basiert auf _Ubuntu_ und erfordert, dass die
TypeScript-Dateien in JavaScript übersetzt sind. Durch das npm-Skript `pack`
wird das Docker-Image `docker.io/juergenzimmermann/buch:1.0.0` mit dem implizit
übersetzten JavaScript-Code gebaut:

```powershell
    # In der 2. PowerShell
    npm run pack
```

Wie das Docker-Image gebaut wurde, kann man anschließend mit folgendem Kommando
inspizieren:

```powershell
    pack inspect juergenzimmermann/buch:1.0.0
```

### Deployment mit Helm

Im Verzeichnis `extras\kubernetes` ist ein Helm-Chart für die Entwicklung des
Appservers. Wenn das Docker-Image erstellt ist (s.o.), kann die Installation in
Kubernetes durchgeführt werden mit

- `helm install buch . -f values.yaml -f dev.yaml` in `extras\kubernetes`
- `helmfile apply` mittels `helmfile.yaml` in `extras\kubernetes`
- `skaffold dev` mittels `skaffold.yaml` im Wurzelverzeichnis

Mit _Lens_ oder _Octant_ kann man anschließend die Installation inspizieren.
Dabei wird die Logdatei im internen Verzeichnis `/var/log/node` angelegt,
welches durch _Mounting_ dem Windows-Verzeichnis `C:\Zimmermann\volumes\buch`
entspricht und mit _Schreibberechtigung_ existieren muss.

Außerdem kann man in `extras\kubernetes` eine Datei `README.md` generieren, die
die Default-Konfigurationswerte für die Helm-basierte Installation enthält.
Dazu ruft man in `extras\kubernetes` das Kommando `helm-docs` auf.

Die Installation kann entsprechend der oben gewählten Installationsvariante
wieder aus Kubernetes entfernt werden:

- `helm uninstall buch` in `extras\kubernetes`
- `helmfile destroy` in `extras\kubernetes`
- `<Strg>C` bei `skaffold dev`

---

## Statische Codeanalyse

### ESLint

_ESLint_ wird durch folgendes npm-Skript ausgeführt:

```powershell
    npm run eslint
```

### SonarQube

Für eine statische Codeanalyse durch _SonarQube_ muss zunächst der
SonarQube-Server mit _Docker Compose_ als Docker-Container gestartet werden:

```powershell
    cd extras\sonarqube
    docker compose up
```

Wenn der Server zum ersten Mal gestartet wird, ruft man in einem Webbrowser die
URL `http://localhost:9000` auf. In der Startseite muss man sich einloggen und
verwendet dazu als Loginname `admin` und ebenso als Password `admin`. Danach
wird man weitergeleitet, um das initiale Passwort zu ändern. Das neue Passwort
trägt man dann in das Skript `sonar-scanner.ps1` im Wurzelverzeichnis ein.
Zur Konfiguration für künftige Aufrufe des _SonarQube-Scanners_ trägt man jetzt
noch in der Konfigurationsdatei `sonar-project.properties` den Projektnamen beim
der Property `sonar.projectKey` ein.

Nachdem der Server gestartet ist, wird der SonarQube-Scanner in einer zweiten
PowerShell mit dem Skript `sonar-scanner.ps1` gestartet. Das Resultat kann dann
in der Webseite des zuvor gestarteten Servers über die URL `http://localhost:9000`
inspiziert werden.

Abschließend wird der oben gestartete Server heruntergefahren.

```powershell
    cd extras\sonarqube
    docker compose down
```

### type-coverage

Mit `type-coverage` kann man ermitteln, wo im TypeScript-Code `any` verwendet
wurde:

```powershell
    npm run type-coverage
```

---

## Sicherheitsanalyse durch snyk

Zunächst muss man sich bei https://app.snyk.io/account registrieren und dort
auch einen Token besorgen. Danach kann man sich folgendermaßen authentifizieren
und das Projekt auf Sicherheitslücken überprüfen

```powershell
    synk auth <MEIN_TOKEN>
    snyk test
```

## AsciiDoctor und PlantUML

Mit AsciiDoctor und PlantUML ist die Dokumentation geschrieben.

### Preview von PlantUML-Dateien

Durch das Tastaturkürzel `<Alt>d`. Dazu ist eine Internet-Verbindung notwendig.
Beispiele für PlantUML und AsciiDoctor sind im Unterverzeichnis `extras\doc`.

### Einstellungen für Preview von AsciiDoctor-Dateien

Zunächst müssen einmalig die Einstellungen (_Settings_) von VS Code geändert
werden. Dazu geht man über zum Menüpunkt _Datei > Einstellungen > Einstellungen_
und gibt im Suchfeld `asciidoc.use_kroki` ein. Nun setzt man den Haken bei
_Enable kroki integration to generate diagrams_.

Wenn man zum ersten Mal eine `.adoc`-Datei im Editor öffnet, muss man noch
die Verbindung zum PlantUML-Server zulassen, damit die eingebundenen
`.puml`-Dateien in `.svg`-Dateien konvertiert werden. Dazu gibt man zunächst
das `<F1>` ein und schickt im Eingabefeld das Kommando
_AsciiDoc: Change Preview Security Settings_ durch `<Enter>` ab.
Danach wählt man den Unterpunkt _Allow insecure content_ aus.

### Preview von AsciiDoctor-Dateien

Durch das Tastaturkürzel `<Strg><Shift>v`. Dazu ist eine Internet-Verbindung
notwendig.

### Dokumentation im Format HTML

Die Dokumentation im Format HTML wird in einer Powershell folgendermaßen
im Verzeichnis `extras\doc\html` erstellt:

```powershell
    npm run asciidoc
```

## Continuous Integration mit Jenkins

Jenkins wird nicht in Kubernetes, sondern direkt mit _Docker Compose_
genutzt. Dadurch muss Jenkins nicht immer laufen und kann bei Bedarf gestartet
und wieder heruntergefahren werden. Dazu muss zunächst das Jenkins-Image um eine
Docker-Installation ergänzt werden, wozu es das Dockerfile `jenkins.dockerfile`
gibt, um ein solches Image zu erstellen:

```powershell
    docker build -t juergenzimmermann/jenkins-swe:1.0.0 . -f jenkins.dockerfile
```

Das neu gebaute Image `juergenzimmermann/jenkins-swe:1.0.0` wird in der
Konfigurationsdatei wird `jenkins.yaml` für Docker Compose verwendet:

```powershell
    docker compose -f jenkins.yaml up
    ...
    # In einer 2. PowerShell: Herunterfahren
    docker compose -f jenkins.yaml down
```

### Aufruf mit Webbrowser

Mit der URL https://localhost:9090 kann man von einem Webbrowser auf das
Jenkins-Image zugreifen. Der Benutzername ist `admin` und das Passwort
`Inf und WI.`.

### Bash zur evtl. Fehlersuche im laufenden Jenkins-Container

```powershell
    docker compose -f jenkins.yaml exec jenkins bash
```

## Monitoring durch clinic

Für Monitoring kann man z.B. `clinic` nutzen, indem man zunächst dem TypeScript-Compiler
durch `npm run tsc` aufruft und danach `npm run clinic`.

Allerdings gibt es noch das offene Ticket
https://github.com/clinicjs/node-clinic-doctor/issues/304

## Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/Download) kann man
kostenfrei herunterladen.

> Tipps:
>
> - `<Strg>kc` : Markierte Zeilen werden auskommentiert (wie bei Visual Studio)
> - `<Strg>ku` : Bei markierten Zeilen wird der Kommentar entfernt
> - `<F1>`: Die Kommandopalette erscheint
> - `<Strg><Shift>v`: Vorschau für MarkDown und AsciiDoctor
> - `<Alt>d`: Vorschau für PlantUml

## Heroku

### Heroku von Salesforce

_Heroku_ ist eine Cloud-Plattform und funktioniert als PaaS
(= Plattform as a Service), so dass man eine Programmier- und Laufzeitumgebung
in der Cloud hat: https://www.heroku.com/platform. Heroku wird seit 2007
entwickelt und wurde 2010 vom CRM-Anbieter
[Salesforce](https://www.salesforce.com/de/products/platform/products/heroku/)
übernommen.

Mit Heroku lassen sich Anwendungen für z.B. _Node_ oder _Java_ entwickeln.
Als Datenbank kann man z.B. _PostgreSQL_ verwenden. Das Deployment erfolgt auf
der Basis von _Git_ (s.u.).

### dyno, slug und buildpack

Heroku-Anwendungen laufen in mehreren leichtgewichtigen _Containern_, die
_dyno_ heißen. Ein _Web dyno_ wird in der Datei `Procfile` mit dem Prozess-Typ
_web_ deklariert. Nur Web dynos können HTTP-Requests empfangen und -Responses
senden.

Nachdem die eigene Anwendung gepackt und komprimiert ist, wird sie als _slug_
bezeichnet. Ein _slug_ kann danach in einem _dyno_ ausgeführt werden.
Die maximale Größe für ein _slug_ beträgt 500 MB.

Mit Hilfe von einem _buildpack_ wird die eigene Anwendung zu einem _slug_
transformiert. Dazu benötigt Heroku diverse Skripte, die von der jeweiligen
Programmiersprache, z.B. JavaScript oder Java, abhängen. Mit diesen Skripten
wird z.B. die Fremdsoftware (_dependencies_) geladen, die man innerhalb der
eigenen Anwendung nutzt, und es wird ggf. der Compiler aufgerufen.

Wenn es im Wurzelverzeichnis eine Datei `package.json` gibt, verwendet Heroku
das _Node.js buildpack_ und ergänzt seine Umgebungsvariable `PATH` um die Pfade
für `node`, `npm` und `node_modules/.bin`.

### Registrierung bei Heroku

Zu Beginn muss man sich bei https://signup.heroku.com registrieren, indem man
das Formular ausfüllt, mit dem Button _CREATE FREE ACCOUNT_ abschickt und
abschließend den Link in der Bestätigungsemail anklickt.

### Einmalig: Git-Repository erstellen

In VS Code sind folgende Einstellungen empfehlenswert, nachdem man das
Beispielprojekt in VS Code geöffnet hat, indem man VS Code startet und über
_Datei_ und den Unterpunkt _Ordner öffnen_ das Verzeichnis mit dem
Beispielprojekt geöffnet hat. Jetzt kann man über _Datei_, den Unterpunkt
_Einstellungen_ und nochmals _Einstellungen_ im Eingabefeld `Git` eingeben.
Nun sieht man die Konfigurationsmöglichkeiten für Git und setzt die Haken bei
`Git: Enable Smart Commit` und bei `Git: Suggest Smart Commit`.

Jetzt klickt man auf das Icon _Quellcodeverwaltung_ am linken Rand und
anschließend auf den Button `Repository initialisieren`.

Man bleibt in der _Quellcodeverwaltung_ und sieht nun viele Dateien markiert mit
`U` (ncommitted). Im Eingabefeld steht der Hinweis _Nachricht_, wo man z.B.
`Initiale` Version eingibt und dann auf den Haken (Tooltipp: _Commit_) klickt.

### Einloggen und Token erstellen mit der Heroku CLI

Mit dem Tastaturkürzel `<F1>` öffnet man die Kommandopalette.
Dort gibt man `heroku login` ein und über das nun geöffnete Powershell-Terminal
wird der Webbrowser mit der Login-URL für Heroku gestartet, so dass man sich
dort einloggen kann, wozu man die Emailadresse und das Passwort von der
zuvor erfolgten Registrierung verwendet.

Nach dem erfolgreichen Einloggen gibt es zur Verwaltung das Verzeichnis
`C:\Users\<MEINE_KENNUNG>\AppData\Local\heroku`.

### Leere Anwendung für Heroku erstellen

Durch `<F1>` kann man in der Kommandopalette `heroku create` eingeben.
Die Ausgabe im Powershell-Terminal sieht dann prinzipiell folgendermaßen aus:

```text
https://gener-iert-12345.herokuapp.com/ | https://git.heroku.com/gener-iert-12345-53594.git
```

Jetzt gibt es also eine generierte Domain für die eigene Anwendung, die künftig
über z.B. https://gener-iert-12345.herokuapp.com/ erreichbar sein wird.

Die ausgegebene URL nimmt man, um in _package.json_ innerhalb von `"scripts": {`
die dortige URL `https://gener-iert-12345.herokuapp.com/` bei den Skripten
`heroku-curl` und `heroku-open` zu überschreiben.

### Add-on für PostgreSQL

Der in Heroku laufende Server benötigt genauso wie der lokal laufende Server
eine Datenbank. Solche zusätzliche Software wird bei Heroku als _Add-on_
bezeichnet. Für Heroku gibt es z.B. _PostgreSQL_ als kostenloses Add-on.

Zur eigenen Heroku-Anwendung fügt man ein Add-on hinzu, indem man den
Karteireiter _Resources_ auswählt. Im Suchfeld unterhalb von _Add-ons_ gibt man
den Wert `Heroku Postgres` ein. Im folgenden modalen Dialog "Plan name" wählt
man den voreingestellten Wert "Hobby Dev - Free" aus und klickt den Button
_Submit Order Form_ an. Nun kann man das installierte Add-On "Heroku Postgres"
(mit den Werten _Attached as DATABASE_ und _Hobby Dev_) anklicken.

Jetzt ist man bei einer neuen URL _https://data.heroku.com/datastores/..._,
wählt den Menüpunkt _Settings_ aus und klickt den Button _View Credentials..._
an. Dort sieht man nun die eigenen Werte für:

- Host
- Database
- User
- Password

Diese Werte werden im nächsten Abschnitt bei den Umgebungsvariablen benötigt.
**BEACHTE:** Heroku für von Zeit zu Zeit Wartungsmaßnahmen durch und generiert
dabei diese Werte **NEU**.

### Umgebungsvariable für Heroku

Wenn man in VS Code die Erweiterungen _Heroku_ und _heroku-cli_ installiert hat,
kann man mit der Kommandopalette durch `<F1>` das Kommando `heroku config:set`
eingeben und anschließend Werte für Umgebungsvariable, wie z.B.
`DB_HOST=?????.amazonaws.com`, wobei ????? gemäß der obigen Postgres-Konfiguration
ersetzt werden müssen. Bei der Eingabe kann man im Powershell-Terminal die
Interaktion mit Heroku verfolgen.

Das wiederholt man dann noch für die Umgebungsvariable mit den passenden
Werten für Benutzername und Passwort aus der Postgres-Konfiguration:

- NODE_ENV=development
- DB_HOST=?????.amazonaws.com
- DB_USERNAME=?????
- DB_PASSWORD=?????
- DB_NAME=?????
- DB_POPULATE=true
- APOLLO_DEBUG=true
- LOG_DIR=/tmp
- LOG_LEVEL_CONSOLE=debug
- LOG_PRETTY=true
- USER_PASSWORD_ENCODED=$argon2i$v=19$m=4096,t=3,p=1$aaxA2v/9rRSPGkwYN+NQog$27Huii1XtD3iEd62fog+04G26LRPZMHoYCI6AGKTL8M

Umgebungsvariable kann man auch mit dem Heroku Dashboard definieren, indem man
bei der eigenen Heroku-Anwendung den Menüpunkt _Settings_ auswählt und danach
den Button _Reveal Config Vars_ anklickt. Damit sollte man insbesondere die
Umgebungsvariable `USER_PASSWORD_ENCODED` (s.o.) setzen, weil in deren String
das Zeichen `$` enthalten ist.

### Deployment für Heroku

Für das erstmalige Deployment und nach künftigen Codeänderungen gibt man
in der Kommandopalette (durch `<F1>`) das Kommando `git push heroku main`
für den eigenen _main-Branch_ im Git-Repository ein. Falls man noch einen
alten Heroku-Stack nutzt kann dieser aktualisiert werden, indem man in einer
PowerShell das Kommando `heroku stack:set heroku-22 -a gener-iert-12345`
aufruft, wobei `gener-iert-12345` durch den Heroku-Namen der eigenen
Anwendung ersetzt wird.

Dadurch wird in Heroku ein _slug_ erstellt: die Anwendung wird gepackt und
komprimiert, so dass sie einschließend in einem _dyno_ (leichtgewichtiger
Linux-Container) ablaufen kann. Im PowerShell-Terminal kann man dabei den Ablauf
mitverfolgen.

```mermaid
stateDiagram
  [*] --> Sources : git push heroku main
  Sources --> Buildsystem
  state Buildsystem {
    [*] --> Buildpack
    Buildpack --> Runtime
    Runtime --> Dependencies
    Dependencies --> slug
  }
  Buildsystem --> dyno
```

Nur die in Git versionierten Dateien werden für das Deployment verwendet,
weshalb nur die TypeScript-Dateien zu Heroku hochgeladen werden, die dann dort
zu lauffähigen JavaScript-Dateien übersetzt werden müssen. Dazu gibt es das
npm-Skript `heroku-postbuild`, das innerhalb von Heroku aufgerufen wird und
nicht manuell aufgerufen werden muss.

Beim das Deployment werden die NPM-Packages aus dem Verzeichnis `node_modules`
immer wieder benötigt. Deshalb nimmt Heroku defaultmäßig ein Caching von
`node_modules` vor.

Nach einem erfolgreichen Deployment sollte man (als Student/in) die
Heroku-Anwendung durch das Kommando `heroku ps:scale web=1` so skalieren, dass
sie nur _1_ Web dyno nutzt. Analog kann man durch `heroku ps:scale web=0` die
eigene Anwendung deaktieren.

### Status-Informationen zu Heroku

Mit `heroku ps` kann man sich anzeigen lassen, wieviele freie "Dyno-Stunden"
man im aktuellen Monat noch hat und wieviele bereits verbraucht sind.
Persönliche Accounts verfügen monatlich über 550 freie "Dyno-Stunden":
https://devcenter.heroku.com/articles/free-dyno-hours.

### Verfügbarkeit der eigenen Heroku-Anwendung

Nach dem Deployment ist die eigene Anwendung verfügbar und kann benutzt
werden. Beispielsweise kann man in einer eigenen Powershell das Kommando
`npm run heroku:invoke-webrequest` aufrufen. Dabei wird mit `Invoke-WebRequest`
auf die URL `https://gener-iert-12345.herokuapp.com/000000000000000000000001`
zugegriffen. Analog kann man `npm run heroku:curl` aufrufen, wobei `curl` statt
`Invoke-WebRequest` verwendet wird.

Alternativ kann man auch `npm run heroku:browser` aufrufen, dann wird der
Response in einem Webbrowser angezeigt.

### Heroku-Console

Mit der Kommandopalette durch `<F1>` kann man
`heroku logs --tail --app gener-iert-12345` eingeben und die Logging-Ausgaben
auf der Heroku-Console mitverfolgen, ähnlich wie bei Linux mit `tail -f`.

### Dashboard für die Verwaltung der eigenen Heroku-Anwendung(en)

Unter https://dashboard.heroku.com kann man die eigene Anwendung verwalten.

Wenn man dort die eigene Anwendung selektiert bzw. anklickt, kann man z.B. über
den Karteireiter _Settings_ eine Anwendung vom Netz nehmen, indem man den
_Maintenance Mode_ einschaltet (am Seitenende). Auch kann man dort die
Anwendung ggf. löschen.

### pgadmin für PostgreSQL

Um _pgadmin_ zur Administration von PostgreSQL als Add-on für Heroku zu nutzen,
startet man einen lokalen Docker-Container mit dem Image für pgadmin:

```powershell
    cd extras\postgres
    docker compose -f .\docker-compose.pgadmin.yaml up

    # Herunterfahren in einer 2. PowerShell:
    docker compose -f .\docker-compose.pgadmin.yaml down
```

In einem Webbrowser ruft man nun die URL `http:localhost:8888` auf. Da pgadmin
auf der Basis von Chromium implementiert ist, empfiehlt es sich, Chrome als
Webbrowser zu verwenden.

Beim Eintrag _Servers_ in der linken Auswahlleiste wählt man mit der rechten
Maustaste den Menüpunkt _Register_ und dann den 1. Unterpunkt _Server..._.
Im Konfigurationsfenster gibt man nun bei _General_ einen Namen für die neue
Serverkonfiguration ein, z.B. `heroku`. Als nächstes wechselt man zum Menüpunkt
_Connection_ und gibt dort die Werte aus der obigen Postgres-Konfiguration ein:

- Host name: Der Rechnername (_Host_ bei Heroku)
- Port: 5432
- Maintenance database: Der Datenbank-Name (_Database_ bei Heroku)
- Username: Der Benutzername (_User_ bei Heroku)
- Password: Das Passwort (_Password_ bei Heroku)

Damit man nicht bei jedem Zugriff das Passwort eingeben muss, empfiehlt es sich,
_Save Password?_ zu aktivieren.

Im Menüpunkt _SSL_ wählt man bei _SSL mode_ den Wert _Require_ aus. Abschließend
gibt man im Menüpunkt _Advanced_ bei _DB restriction_ nochmals den Namen der
Datenbank ein.

### Sonstige Heroku-Kommandos

Mit `heroku run ...` kann man ein einzelnes Kommando als REPL
(= Read-eval-print loop) laufen lassen. So zeigt z.B. das Kommando
`heroku run --app gener-iert-12345 node --version` an, welche Node-Version für
die Heroku-Anwendung verwendet wird.
Oder mit `heroku run --app gener-iert-12345 printenv` kann man sich die
Umgebungsvariable für die Heroku-Anwendung anzeigen lassen.

Mit `heroku addons` kann man sich zusätzlich installierte Add-ons anzeigen
lassen.

## Empfohlene Code-Konventionen

In Anlehnung an die
[Guidelines von TypeScript](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)

- "Feature Filenames", z.B. buch.service.ts
- Klassennamen mit PascalCase
- Union-Types (mit Strings) statt Enums
- Attribute und Funktionen mit camelCase
- private Properties _nicht_ mit vorangestelltem **\_**
- Interfaces _nicht_ mit vorangestelltem **I**
- _Barrel_ für häufige Imports, z.B.
  - `config\index.ts` erstellen:

```javascript
    export * from './bar';
    export * from './foo';
```

- einfaches Importieren:

```javascript
    import { Bar, Foo } from 'config';
```

- [...].`forEach`(), [...].`filter`() und [...].`map`() statt for-Schleife
- Arrow-Functions statt function()
- `undefined` verwenden und nicht `null`
- Geschweifte Klammern bei if-Anweisungen
- Maximale Dateigröße: 400 Zeilen
- Maximale Funktionsgröße: 75 Zeilen
