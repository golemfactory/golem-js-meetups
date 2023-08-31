#!/usr/bin/env bash

docker build -t golem/tesseract:latest .
gvmkit-build --push golem/tesseract:latest