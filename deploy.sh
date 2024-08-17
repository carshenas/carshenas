#! /bin/bash

source /root/.bashrc

if [ "$1" == "main" ]; then
  username="$FARZAD_DOCKER_USERNAME"
  password="$FARZAD_DOCKER_PASSWORD"
  image="main"
else
  username="$FARHAD_DOCKER_USERNAME"
  password="$FARHAD_DOCKER_PASSWORD"
  image="development"
fi

cd carshenas-frontend
docker login -u "$username" -p "$password"
docker pull "$username"/carshenas:latest
docker logout
docker compose up --force-recreate "$image" -d
