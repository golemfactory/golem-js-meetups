#!/usr/bin/env bash

docker build -t golem/node:20 .
gvmkit-build --push golem/node:20