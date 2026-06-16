import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function loadEnv(appBasePath) {
  const env = { ...process.env };
  const envPath = join(appBasePath, '.env');

  if (!existsSync(envPath)) {
    return env;
  }

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = stripQuotes(trimmed.slice(separatorIndex + 1).trim());

    env[key] = value;
  }

  return env;
}

export function requireEnv(env, keys) {
  const missing = keys.filter((key) => env[key] === undefined || env[key] === '');

  if (missing.length > 0) {
    throw new Error(`Missing required environment values: ${missing.join(', ')}`);
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
