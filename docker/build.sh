#! /bin/bash
set -e
set +x
name=${1:-webui}
docker_dir=$(dirname $0)
echo "Building image: ${name}"

docker build ${docker_dir} -t ${name}