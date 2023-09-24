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

const config = useRuntimeConfig();

let libsql: LibSQLDatabase | BetterSQLite3Database | null = null;

if (!libsql) {
  if (process.env.NODE_ENV === 'production') {
    const client = createClient({
      url: config.databaseUrl,
      authToken: config.databaseAuthToken,
    });
    libsql = drizzleLibSQL(client);
  } else {
    const client = new Database(join(config.dbDir, './db.sqlite'));
    libsql = drizzleBetterSQLite3(client);
  }
}

export const db = libsql;
