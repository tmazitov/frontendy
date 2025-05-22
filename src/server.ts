import Fastify from 'fastify'
import { readFile } from "fs/promises";
import fastifyStatic from '@fastify/static';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify()
const port = process.env.PORT || 3000; 


async function main() {
  // First register static file serving
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
  });

  // Then the catch-all for client-side routing
  app.get("/*", async (request, reply) => {
    const requestURL = request.raw.url ? request.raw.url : ""
    const url = new URL(requestURL, `http://${request.headers.host}`);
    if (path.extname(url.pathname)) {
      return reply.callNotFound();
    }
    const html = await readFile('index.html', 'utf-8');
    return reply.type('text/html').send(html)
  });

  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    console.log("Server listening at " + address)
  })
}

main()
