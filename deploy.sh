#! /bin/bash

if [ $1 == "main" ]; then
  branch = main
else
  branch = development
fi

cd carshenas-frontend
git checkout $branch
git pull origin $branch
docker compose build
docker compose down
docker compose up -d
