import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { serverSupabaseServiceRole } from '#supabase/server';
import { users, type User } from '~/db/schema';
import adminRoutes from '~/server/adminRoutes';

export default defineEventHandler(async (event) => {
  await adminRoutes(event);

  const { id } = await readBody<User>(event);

  try {
    const deleted: User[] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      throw createError({ statusCode: 404, message: 'User Not Found' });
    }

    const client = serverSupabaseServiceRole(event);
    const { error } = await client.auth.admin.deleteUser(id);

    if (error) {
      throw createError(error);
    }

    setResponseStatus(event, 200, 'OK');
    return { user: deleted[0] };
  } catch (err) {
    handleError(event, err);
  }
});
