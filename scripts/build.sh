#/usr/bin/env bash

# David Affinito
# 2018
#
# This script ensures we have a fresh production build and docker iamge
# 1. Delete old production build assets
# 2. Remove any old docker images
# 3. Rebuild docker image with no cache

if [ "$1" == "production" ]; then
	rm -rf ./client/build
	docker rmi dmh
	docker build -t dmh -f ./Dockerfile.prod . --no-cache
else
	rm -rf ./client/build
	docker rmi dmh-staging
	docker build -t dmh-staging -f ./Dockerfile.staging . --no-cache
fi
