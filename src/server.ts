import Fastify from 'fastify'
import { readFile } from "fs/promises";
import fastifyStatic from '@fastify/static';
import path from 'path';

const app = Fastify()

async function main() {
  // First register static file serving
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
  });

  // Then the catch-all for client-side routing
  app.get("/*", async (request, reply) => {
    const url = request.url;
    if (path.extname(url)) {
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
