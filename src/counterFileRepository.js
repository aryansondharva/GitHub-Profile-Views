import {
  accessSync,
  appendFileSync,
  constants,
  existsSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

import { InvalidPathError } from './errors.js';

export class CounterFileRepository {
  constructor(storagePath) {
    if (!existsSync(storagePath) || !statSync(storagePath).isDirectory()) {
      throw new InvalidPathError('Counter storage is not a directory');
    }

    try {
      accessSync(storagePath, constants.W_OK);
    } catch {
      throw new InvalidPathError('Counter storage is not writable');
    }

    this.storagePath = storagePath;
  }

  async getViewsCountByUsername(username) {
    const counterFilePath = this.getCounterFilePath(username);

    if (!existsSync(counterFilePath)) {
      return 0n;
    }

    return parseStoredCount(readFileSync(counterFilePath, 'utf8'));
  }

  async addViewByUsername(username) {
    appendFileSync(this.getViewsFilePath(username), `${new Date().toISOString()}\n`);

    try {
      this.incrementViewsCount(username);
    } catch {
      // The views log is the source of truth; the count file can be rebuilt.
    }
  }

  incrementViewsCount(username) {
    const counterFilePath = this.getCounterFilePath(username);
    const previous = existsSync(counterFilePath)
      ? parseStoredCount(readFileSync(counterFilePath, 'utf8'))
      : 0n;

    writeFileSync(counterFilePath, (previous + 1n).toString());
  }

  getViewsFilePath(username) {
    return join(this.storagePath, `${username.toString()}-views`);
  }

  getCounterFilePath(username) {
    return join(this.storagePath, `${username.toString()}-views-count`);
  }
}

function parseStoredCount(content) {
  const value = content.trim();

  if (value === '') {
    return 0n;
  }

  if (!/^\d+$/.test(value)) {
    throw new Error('Stored counter value must only contain digits');
  }

  return BigInt(value);
}
