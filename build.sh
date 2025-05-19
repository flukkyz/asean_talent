#!/bin/bash
stty -echo
echo "Enter your bitbucket password: "
read PASSWORD
stty echo
git pull https://flukkyz:$PASSWORD@bitbucket.org/flukkyz/asean_talent.git
if [ $? -eq 0 ]; then
  IMAGE_ID=$(docker image ls --filter=reference="flukkyz/nuxt:asean" --format "{{.ID}}")
  if [ -z "$IMAGE_ID" ]; then
    echo "Old image not found. Start building..."
  else
    echo "Old image exists. Removing..."
    docker rmi $IMAGE_ID
    echo "Remove old images successful. Start building..."
  fi
  docker build -t flukkyz/nuxt:asean .
  docker push flukkyz/nuxt:asean
  echo "Docker build and push completed."
else
    echo "Git pull failed"
fi