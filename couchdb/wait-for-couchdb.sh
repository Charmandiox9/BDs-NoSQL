#!/bin/bash

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Esperando que $host:$port esté disponible..."

until curl -f http://$host:$port/_up > /dev/null 2>&1; do
  echo "CouchDB no está listo - durmiendo..."
  sleep 2
done

echo "CouchDB está listo - ejecutando comando"
exec $cmd