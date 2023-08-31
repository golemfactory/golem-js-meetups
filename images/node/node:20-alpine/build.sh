#!/usr/bin/env bash

docker build -t golem/node:20-alpine .
gvmkit-build --push golem/node:20-alpine