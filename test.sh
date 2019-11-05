#!/bin/bash

docker build -t math-api .
docker run --rm -t math-api