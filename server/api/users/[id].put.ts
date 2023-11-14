import { eq } from 'drizzle-orm';
import { users, type UserSubmit } from '~/db/schema';
import { serverSupabaseServiceRole } from '#supabase/server';
import adminRoutes from '~/server/adminRoutes';

export default defineEventHandler(async (event) => {
  await adminRoutes(event);

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'No Id Provided' });
  }

  const { firstName, lastName, roleId } = await readBody<UserSubmit>(event);

  const client = serverSupabaseServiceRole(event);

  const { data, error } = await client.auth.admin.updateUserById(id, {
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
    },
    app_metadata: {
      role: roleId,
    },
  });

  if (error) {
    throw createError(error);
  }

  if (!data.user) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  try {
    const user = await db
      .update(users)
      .set({
        firstName,
        lastName,
        roleId,
      })
      .where(eq(users.id, id))
      .returning();

    if (!user || user.length === 0) {
      throw createError({ statusCode: 500, message: 'Could Not Update User' });
    }

    setResponseStatus(event, 200, 'OK');
    return { user: data.user };
  } catch (err) {
    handleError(event, err);
  }
});
