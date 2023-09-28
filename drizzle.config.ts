import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const driver = isProd ? 'turso' : 'better-sqlite';
const url = isProd
  ? (process.env.NUXT_DATABASE_URL as string)
  : './db/db.sqlite';
const authToken = isProd
  ? (process.env.NUXT_DATABASE_AUTH_TOKEN as string)
  : undefined;

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver,
  dbCredentials: {
    url,
    authToken,
  },
} satisfies Config;
