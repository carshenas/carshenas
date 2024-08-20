#! /bin/bash

source /root/.bashrc

if [ "$1" == "main" ]; then
  echo $FARZAD_DOCKER_PASSWORD | docker login -u farzadjambor --password-stdin
  docker pull farzadjambor/carshenas:latest
  image="main"

else
  echo $FARHAD_DOCKER_PASSWORD | docker login -u sadeq76 --password-stdin
  docker pull sadeq76/carshenas:latest
  image="development"

fi

docker logout

echo "Recreating ..."
cd carshenas-frontend
docker compose up --force-recreate "$image" -d
echo "Recreated."