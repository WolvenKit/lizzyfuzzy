#!/bin/bash

docker build --tag 'simply_lizzy' .
docker container stop lizzy
docker container remove lizzy
docker run -d --restart unless-stopped --name 'lizzy' 'simply_lizzy'
