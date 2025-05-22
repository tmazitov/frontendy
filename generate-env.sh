#!/bin/bash

if [ ! -f .env ]; then
  echo "❌ File .env doesn't exist"
  exit 1
fi

set -o allexport
source .env
set +o allexport

echo "window.__ENV__ = {" > public/env.js

while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" == \#* ]] && continue

  value="${value//\"/\\\"}"

  echo "  $key: \"$value\"," >> public/env.js
done < <(grep -v '^#' .env | grep -E '^[A-Za-z_][A-Za-z0-9_]*=')

echo "};" >> public/env.js

echo "✅ All env variables are exported to the public/env.js"
