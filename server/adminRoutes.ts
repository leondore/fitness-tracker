import type { H3Event, EventHandlerRequest } from 'h3';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import type { User } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';
import { db } from '~/server/utils/db';
import { users } from '~/db/schema';
import { Role } from '~/types/auth';

declare module 'h3' {
  interface H3EventContext {
    auth: User;
  }
}

const unauthorizedError = createError({
  statusCode: 401,
  message: 'Unauthorized',
});

export default async (event: H3Event<EventHandlerRequest>) => {
  let token: string | undefined;
  const TOKEN_KEY = 'sb-access-token=';
  const cookies = getHeader(event, 'Cookie');
  const tokenKeyIdx = cookies?.indexOf(TOKEN_KEY);
  if (typeof tokenKeyIdx === 'number' && tokenKeyIdx > -1) {
    const tokenKey = cookies?.substring(tokenKeyIdx + TOKEN_KEY.length);
    token = tokenKey?.substring(0, tokenKey.indexOf(';'));
  }

  if (!token) {
    throw unauthorizedError;
  }

  const { jwtSecret } = useRuntimeConfig();
  const secret = new TextEncoder().encode(jwtSecret);
  const { payload } = await jwtVerify(token, secret);

  if (!payload.sub || !payload.aud || payload.aud !== 'authenticated') {
    throw unauthorizedError;
  }

  const user = await serverSupabaseUser(event);
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, payload.sub),
  });

  if (!user || !dbUser || dbUser.roleId !== Role.Admin) {
    throw unauthorizedError;
  }
};
