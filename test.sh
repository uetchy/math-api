#!/bin/bash -eo pipefail

docker build -t math-api .
docker run --rm -it math-api