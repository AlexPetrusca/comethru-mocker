#!/usr/bin/env bash

set -e

IMAGE_NAME="alexpetrusca/comethru-mocker"
IMAGE_TAG="latest"

# Parse tag argument if provided
if [ -n "$1" ]; then
    IMAGE_TAG="$1"
fi

echo "Building and pushing Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"

# Build the Docker image
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ./server

# IMAGE_TAG as latest if not already
if [ "$IMAGE_TAG" != "latest" ]; then
    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
fi

# Push to Docker Hub
docker push ${IMAGE_NAME}:${IMAGE_TAG}

if [ "$IMAGE_TAG" != "latest" ]; then
    docker push ${IMAGE_NAME}:latest
fi

echo "Successfully pushed ${IMAGE_NAME}:${IMAGE_TAG} to Docker Hub"
