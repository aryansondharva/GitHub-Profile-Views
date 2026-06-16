import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createRequestHandler } from './app.js';
import { loadEnv } from './config.js';

const appBasePath = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = loadEnv(appBasePath);
const port = Number(env.PORT ?? 3002);
const server = createServer(createRequestHandler({ appBasePath }));

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Set PORT to another value, for example PORT=${port + 1}.`
    );
    process.exit(1);
  }

  throw error;
});

server.listen(port, () => {
  console.log(`GitHub Profile Views Counter is running at http://localhost:${port}`);
});
