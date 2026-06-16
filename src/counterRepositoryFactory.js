import { join } from 'node:path';

import { loadEnv, requireEnv } from './config.js';
import { CounterFileRepository } from './counterFileRepository.js';
import { createPostgresRepository } from './counterPdoRepository.js';

export async function createCounterRepository(appBasePath) {
  const env = loadEnv(appBasePath);
  const repositoryType = env.REPOSITORY ?? 'file';

  switch (repositoryType) {
    case 'file': {
      const storagePath = env.FILE_STORAGE_PATH !== undefined && env.FILE_STORAGE_PATH !== ''
        ? env.FILE_STORAGE_PATH
        : join(appBasePath, 'storage');

      return new CounterFileRepository(storagePath);
    }

    case 'pdo':
    case 'postgres':
      requireEnv(env, ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']);
      return createPostgresRepository(env);

    default:
      throw new Error(`Unsupported repository \`${repositoryType}\``);
  }
}
