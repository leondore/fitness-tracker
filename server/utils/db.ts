import { type LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../../db/schema';

const config = useRuntimeConfig();
const prodCredentials = {
  url: config.databaseUrl,
  authToken: config.databaseAuthToken,
};

let libsql: LibSQLDatabase<typeof schema> | null = null;

if (!libsql) {
  if (
    prodCredentials.url === undefined ||
    prodCredentials.authToken === undefined ||
    prodCredentials.url === '' ||
    prodCredentials.authToken === ''
  ) {
    throw new Error('Missing database credentials');
  }

  const client = createClient(prodCredentials);
  libsql = drizzle(client, { schema });
}

export const db = libsql;
