#!groovy

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

// https://www.jenkins.io/doc/tutorials/create-a-pipeline-in-blue-ocean/

pipeline {
    // agent any
    agent {
        docker {
            // https://www.debian.org/releases: Bullseye = Debian 11
            image 'node:18.8.0-bullseye'
            // https://stackoverflow.com/questions/62330354/jenkins-pipeline-alpine-agent-apk-update-error-unable-to-lock-database-permis
            // https://stackoverflow.com/questions/42630894/jenkins-docker-how-to-control-docker-user-when-using-image-inside-command/51986870#51986870
            // https://stackoverflow.com/questions/42743201/npm-install-fails-in-jenkins-pipeline-in-docker
            args '--publish 3000:3000 --publish 5000:5000'
            // fuer "apt-get install ..."
            args '--user root:root'

            // node:...-bullseye : in /etc/passwd gibt es "node" mit uid=1000
            //args '--user 1000:1000'
        }
    }

    // Umgebungsvariable:
    environment {
        // Heroku:
        DB_HOST = '?????.amazonaws.com'
        DB_USER = '?????'
        DB_PASS = '?????'
        DB_POPULATE = true

        LOG_DIR = './log'
        LOG_LEVEL_CONSOLE = 'debug'
        MAIL_HOST = 'skip'
        USER_PASSWORD_ENCODED = '$argon2i$v=19$m=4096,t=3,p=1$aaxA2v/9rRSPGkwYN+NQog$27Huii1XtD3iEd62fog+04G26LRPZMHoYCI6AGKTL8M'
    }

    options {
      // Timeout fuer den gesamten Job
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        // Stage = Logisch-zusammengehoerige Aufgaben der Pipeline:
        // zur spaeteren Visualisierung
        stage('Init') {
            // Step = einzelne Aufgabe
            steps {
                script {
                    if (!isUnix()) {
                        error 'Unix ist erforderlich'
                    }
                }

                echo "Jenkins-Job ${env.JOB_NAME} #${env.BUILD_ID} mit Workspace ${env.WORKSPACE}"

                // Unterverzeichnisse src und test im WORKSPACE loeschen: vom letzten Build
                // Kurzform fuer: sh([script: '...'])
                sh 'rm -rf src'
                sh 'rm -rf test'

                // https://www.jenkins.io/doc/pipeline/steps/git
                // "named arguments" statt Funktionsaufruf mit Klammern
                git url: 'https://github.com/juergenzimmermann/buch', branch: 'main', poll: true
            }
        }

        stage('Install') {
            steps {
                // https://stackoverflow.com/questions/51416409/jenkins-env-node-no-such-file-or-directory
                // https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
                // https://www.debian.org/distrib/packages
                // https://packages.debian.org/buster/nodejs
                sh 'cat /etc/passwd'
                sh 'id'
                // sh 'apt-get install --yes sudo=1.8.27-1+deb10u3'

                // sh 'apt update'
                // sh 'apt upgrade'
                // sh 'apt install sudo'

                sh 'curl --silent --fail --show-error --location https://deb.nodesource.com/setup_18.x | bash -; apt-get install --yes nodejs'

                sh 'node --version'
                sh 'npm i -g npm@8.18.0'
                sh 'npm --version'

                // https://packages.debian.org/stable/python/python3
                // https://packages.debian.org/bullseye/python3
                sh 'apt-get install --yes python3=3.9.2-3'
                // sh 'python --version'

                // https://docs.docker.com/engine/install/debian/#install-from-a-package
                // https://download.docker.com/linux/debian/dists/bullseye/pool/stable/amd64/docker-ce_20.10.9~3-0~debian-bullseye_amd64.deb
                // https://packages.debian.org/bullseye/docker.io
                // sh 'curl --silent --location https://download.docker.com/linux/debian/dists/bullseye/pool/stable/amd64/docker-ce_20.10.9~3-0~debian-bullseye_amd64.deb > /tmp/docker.deb; sudo dpkg -i /tmp/docker.deb'
                // https://medium.com/@manav503/how-to-build-docker-images-inside-a-jenkins-container-d59944102f30
                sh 'apt-get install --yes --no-install-recommends docker.io=20.10.5+dfsg1-1+deb11u1'
                sh 'docker --version'

                script {
                    if (!fileExists("${env.WORKSPACE}/package.json")) {
                        echo "package.json ist *NICHT* in ${env.WORKSPACE} vorhanden"
                    }
                }

                // "clean install", Dauer: ca. 5 Minuten
                sh 'npm ci --force'
                //sh 'npm audit fix'
            }
        }

        stage('Compile') {
            steps {
                sh 'npx tsc --version'
                // Dauer < 1 Min. (Warum funktioniert npx nicht?)
                sh './node_modules/.bin/tsc'
            }
        }

        stage('Test, Codeanalyse, Security, Dok.') {
            steps {
                parallel(
                    'Test': {
                        echo 'TODO: Rechnername/IP-Adresse des DB-Servers fuer Tests konfigurieren'
                        //sh 'npm run test:coverage'
                    },
                    'ESLint': {
                        sh 'npx eslint --version'
                        echo 'TODO: ESLint ist aus Kapazitaetsgruenden auskommentiert'
                        //sh 'npm run eslint'
                    },
                    'Security Audit': {
                        sh 'npm audit --omit=dev'
                    },
                    'AsciiDoctor': {
                        sh 'npx asciidoctor --version'
                        sh 'npm run asciidoctor'
                    },
                    'reveal.js': {
                        sh 'npx asciidoctor-revealjs --version'
                        sh 'npm run revealjs'
                    },
                    'TypeDoc': {
                        sh 'npx typedoc --version'
                        echo 'TODO: TypeDoc ist aus Kapazitaetsgruenden auskommentiert'
                        //sh 'npm run typedoc'
                    }
                )
            }

            post {
                always {
                  echo 'TODO: Links fuer Coverage und TypeDoc'

                  publishHTML (target : [
                    reportDir: 'extras/doc/entwicklerhandbuch/html',
                    reportFiles: 'entwicklerhandbuch.html',
                    reportName: 'Entwicklerhandbuch',
                    reportTitles: 'Entwicklerhandbuch'
                  ])

                  publishHTML target : [
                   reportDir: 'extras/doc/folien',
                   reportFiles: 'folien.html',
                   reportName: 'Folien (reveal.js)',
                   reportTitles: 'reveal.js'
                  ]

                  //publishHTML target : [
                  //  reportDir: 'coverage',
                  //  reportFiles: 'index.html',
                  //  reportName: 'Coverage (Istanbul)',
                  //  reportTitles: 'Coverage'
                  //]

                  //publishHTML target : [
                  // reportDir: 'extras/doc/api',
                  // reportFiles: 'index.html',
                  // reportName: 'TypeDoc',
                  // reportTitles: 'TypeDoc'
                  //]
                }

                success {
                    script {
                        if (fileExists("${env.WORKSPACE}/buch.zip")) {
                            sh 'rm buch.zip'
                        }
                    }
                    // https://www.jenkins.io/doc/pipeline/steps/pipeline-utility-steps/#zip-create-zip-file
                    zip zipFile: 'buch.zip', archive: false, dir: 'dist'
                    // jobs/buch/builds/.../archive/buch.zip
                    archiveArtifacts 'buch.zip'
                }
            }
        }

        stage('Docker Image bauen') {
            steps {
              echo 'TODO: Docker-Image bauen: dockerd starten, pack installieren'
              // Docker-Installation und laufender Docker-Daemon erforderlich
              // sh 'docker build --tag juergenzimmermann/buch:1.0.0 .'
            }
        }

        stage('Deployment fuer Kubernetes') {
            steps {
                echo 'TODO: Deployment fuer Kubernetes mit z.B. Ansible'
            }
        }
    }
}
