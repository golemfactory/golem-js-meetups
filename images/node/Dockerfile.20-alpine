FROM node:20-alpine

RUN apk upgrade --update-cache --available && apk add openssl
RUN rm -rf /var/cache/apk/*

VOLUME /golem/input /golem/output /golem/work
WORKDIR /golem/work
