#!/usr/bin/env bash

docker build -t golem/node:20 -t golem/node:latest -f Dockerfile.20 .
gvmkit-build --push golem/node:20
gvmkit-build --push golem/node:latest

docker build -t golem/node:20-alpine -f Dockerfile.20-alpine .
gvmkit-build --push golem/node:20-alpine

docker build -t golem/node:18 -f Dockerfile.18 .
gvmkit-build --push golem/node:18

docker build -t golem/node:18-alpine -f Dockerfile.18-alpine .
gvmkit-build --push golem/node:18-alpine