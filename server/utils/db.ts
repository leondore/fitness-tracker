import { type LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../../db/schema';

const config = useRuntimeConfig();
const credentials = {
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
};

let libsql: LibSQLDatabase<typeof schema> | null = null;

if (!libsql) {
  if (
    credentials.url === undefined ||
    credentials.authToken === undefined ||
    credentials.url === '' ||
    credentials.authToken === ''
  ) {
    throw new Error('Missing database credentials');
  }

  const client = createClient(credentials);
  libsql = drizzle(client, { schema });
}

export const db = libsql;
