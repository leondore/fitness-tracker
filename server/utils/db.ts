import { join } from 'path';
import {
  type LibSQLDatabase,
  drizzle as drizzleLibSQL,
} from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import {
  type BetterSQLite3Database,
  drizzle as drizzleBetterSQLite3,
} from 'drizzle-orm/better-sqlite3';
// @ts-ignore
// eslint-disable-next-line import/no-named-as-default
import Database from 'better-sqlite3';
import * as schema from '../../db/schema';

const config = useRuntimeConfig();
const prodCredentials = {
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
};

let libsql:
  | LibSQLDatabase<typeof import('@/db/schema')>
  | BetterSQLite3Database<typeof import('@/db/schema')>
  | null = null;

if (!libsql) {
  if (process.env.NODE_ENV === 'production') {
    if (
      prodCredentials.url === undefined ||
      prodCredentials.authToken === undefined ||
      prodCredentials.url === '' ||
      prodCredentials.authToken === ''
    ) {
      throw new Error('Missing database credentials');
    }

    const client = createClient(prodCredentials);
    libsql = drizzleLibSQL(client, { schema });
  } else {
    const client = new Database(join(config.dbDir, './db.sqlite'));
    libsql = drizzleBetterSQLite3(client, { schema });
  }
}

export const db = libsql;
