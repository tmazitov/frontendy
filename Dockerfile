FROM node:22

WORKDIR /app

ENV PORT=3000
ENV GOOGLE_OAUTH_CLIENT_ID=client_id
ENV GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/oauth-callback
ENV UMS_ADDR=localhost:5000/auth
ENV MMRS_ADDR=localhost:5001/mmrs
ENV GAME_ADDR=localhost:5002/game
ENV SECURE=false

COPY package*.json ./

RUN npm install

COPY . .

RUN npx esbuild src/client.ts --bundle --outfile=public/client.js --format=esm

RUN npm run build

EXPOSE ${PORT}

RUN chmod +x ./docker-run.sh

CMD ["sh", "./docker-run.sh"]

