#!/bin/bash

docker build -t math-api-test .
docker run --rm -t math-api-test