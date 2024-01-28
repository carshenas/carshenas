#! /bin/bash

if [ $1 == "main" ]; then
  branch = main
  image = main
else
  branch = development
  image = development
fi

cd carshenas-frontend
git checkout $branch
git pull origin $branch
docker compose build $image
docker compose up --force-recreate $image -d
