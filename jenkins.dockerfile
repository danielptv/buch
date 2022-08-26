# Copyright (C) 2022 - present Juergen Zimmermann, Hochschule Karlsruhe
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
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

# Aufruf:   docker build -t juergenzimmermann/jenkins-swe:1.0.0 . -f jenkins.dockerfile
#           docker sbom juergenzimmermann/jenkins-swe:1.0.0
# https://www.jenkins.io/doc/book/installing/docker
FROM jenkins/jenkins:2.346.3-lts-jdk17-preview
#FROM jenkins/jenkins:2.346.3-jdk11
USER root
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
USER jenkins
# https://plugins.jenkins.io/blueocean
# https://plugins.jenkins.io/docker-workflow
# 521.v1a_a_dd2073b_2e
RUN jenkins-plugin-cli --plugins "blueocean:1.25.6 docker-workflow:521.v1a_a_dd2073b_2e"
#RUN jenkins-plugin-cli --plugins "blueocean:1.25.6 docker-workflow:1.29"
