npx esbuild src/client.ts --bundle --outfile=public/client.js --format=esm
ts-node src/server.ts