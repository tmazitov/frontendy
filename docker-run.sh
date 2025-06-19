export MODE="production"

bash ./generate-prod-env.sh

exec node ./dist/server.js