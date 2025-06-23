#!/bin/bash

echo "window.__ENV__ = {" > public/env.js

for key in SECURE PORT GOOGLE_OAUTH_CLIENT_ID GOOGLE_OAUTH_REDIRECT_URI UMS_ADDR MMRS_ADDR GAME_ADDR MODE; do
    value="${!key}"
    [[ -z "$value" ]] && continue

    value="${value//\"/\\\"}"

    echo "  $key: \"$value\"," >> public/env.js
done

echo "};" >> public/env.js

echo "✅ Selected env variables are exported to the public/env.js"