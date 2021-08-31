#/usr/bin/env bash

# David Affinito
# 2018
#
# This script deploys to the environment specified, staging by default

# env vars
export AWS_REGISTRY_URL=REMOVED.dkr.ecr.us-west-2.amazonaws.com
export AWS_DEFAULT_REGION=us-west-2

if [ "$1" == "production" ]; then
	export IMAGE_NAME=dmh:latest
	export AWS_ECS_CLUSTER_NAME=dmh-cluster
	export AWS_ECS_SERVICE_NAME=dmh-service
	export DOCKERFILE=Dockerfile.prod
else
	export IMAGE_NAME=dmh-staging:latest
	export AWS_ECS_CLUSTER_NAME=dmh-staging-cluster
	export AWS_ECS_SERVICE_NAME=dmh-staging-service
	export DOCKERFILE=Dockerfile.staging
fi

# login
eval $(aws ecr get-login --no-include-email --region us-west-2)

# build image
docker build -t $IMAGE_NAME -f ./$DOCKERFILE .
docker tag $IMAGE_NAME $AWS_REGISTRY_URL/$IMAGE_NAME
docker push $AWS_REGISTRY_URL/$IMAGE_NAME

# force aws to update
aws ecs update-service --force-new-deployment --cluster $AWS_ECS_CLUSTER_NAME --service $AWS_ECS_SERVICE_NAME
