import type { H3Event, EventHandlerRequest } from 'h3';
import type { User } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

declare module 'h3' {
  interface H3EventContext {
    auth: User;
  }
}

export default async (event: H3Event<EventHandlerRequest>) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
};
