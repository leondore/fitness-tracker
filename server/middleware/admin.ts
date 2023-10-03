import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  if (event.path.includes('/admin')) {
    const user = await serverSupabaseUser(event);
    if (user) event.context.auth = user;
  }
});
