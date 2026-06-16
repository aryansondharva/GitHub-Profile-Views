import { createRequestHandler } from '../src/app.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appBasePath = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const handler = createRequestHandler({ appBasePath });

export default async function (req, res) {
  // Pass req and res to the main app request handler
  await handler(req, res);
}
