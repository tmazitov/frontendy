bash ./generate-env.sh
if [ $? -ne 0 ]; then
    exit 1
fi

npx esbuild src/client.ts --bundle --outfile=public/client.js --format=esm
if [ $? -ne 0 ]; then
    exit 1
fi
ts-node src/server.ts