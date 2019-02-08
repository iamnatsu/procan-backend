#!/bin/bash

cd "$(dirname $0)"

LABEL=$1;shift

if [ "$LABEL" == "" ]; then
	echo "USAGE: $0 label"
	exit 1
fi

if [ ! -d "build/app" ]; then
	echo 'Must run `npm run build` before push docker.'
	exit 2
fi

PUSH=${PUSH:-}

set -ue

rm -rf build/docker
mkdir -p build/docker

# node
cp -pr docker/node build/docker/
cp -pr build/app build/docker/node/
docker build --tag="nwada/procan-ap:$LABEL" build/docker/node
