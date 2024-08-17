#! /bin/bash

source /root/.bashrc

if [ "$1" == "main" ]; then
  docker login -u farzadjambor -p "$FARZAD_DOCKER_PASSWORD"
  docker pull farzadjambor/carshenas:latest
  image="main"

else
  docker login -u sadeq76 -p "$FARHAD_DOCKER_PASSWORD"
  docker pull farzadjambor/carshenas:latest
  image="development"

fi

docker logout

echo "Recreating ..."
cd carshenas-frontend
docker compose up --force-recreate "$image" -d
echo "Recreated."