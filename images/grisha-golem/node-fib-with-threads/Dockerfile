FROM node:20-alpine

COPY . /src/app
WORKDIR /src/app

RUN npm install
RUN npm run compile

WORKDIR /golem/work
VOLUME /golem/input /golem/output /golem/work

