import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createRequestHandler } from './app.js';

const appBasePath = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT ?? 3000);
const server = createServer(createRequestHandler({ appBasePath }));

server.listen(port, () => {
  console.log(`GitHub Profile Views Counter is running at http://localhost:${port}`);
});
