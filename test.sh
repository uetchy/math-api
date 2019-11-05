#!/bin/bash

docker build -t math-api .
docker run --rm -it math-api