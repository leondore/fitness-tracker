import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const url = process.env.NUXT_DATABASE_URL as string;
const authToken = process.env.NUXT_DATABASE_AUTH_TOKEN as string;

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'turso',
  dbCredentials: {
    url,
    authToken,
  },
} satisfies Config;
