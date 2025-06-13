import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify();

const mode = process.env.MODE || 'development';
const host = mode === 'development' ? 'localhost' : '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10);

app.register(fastifyStatic, {
	root: path.join(__dirname, '../public'),
	prefix: '/public/',
});

app.get('/*', async (request, reply) => {
	const url = new URL(request.url, `http://localhost`);

	if (path.extname(url.pathname)) {
		return reply.code(404).send();
	}

	try {
		const html = await readFile(path.join(__dirname, '../public/index.html'), 'utf-8');
		return reply.type('text/html').send(html);
	} catch (err) {
		console.error(err)
		return reply.code(500).send('Internal Server Error');
	}
});

app.listen({ host, port }, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	console.log(`🚀 Server listening at ${address}`);
});
