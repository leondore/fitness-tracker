import { users, type UserSubmit } from '~/db/schema';
import { serverSupabaseServiceRole } from '#supabase/server';
import adminRoutes from '~/server/adminRoutes';

export default defineEventHandler(async (event) => {
  await adminRoutes(event);

  const { email, firstName, lastName, roleId } =
    await readBody<UserSubmit>(event);

  const client = serverSupabaseServiceRole(event);

  const { data, error } = await client.auth.admin.createUser({
    email,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
    },
    app_metadata: {
      role: roleId,
    },
    email_confirm: true,
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
      .insert(users)
      .values({
        id: data.user.id,
        email,
        firstName,
        lastName,
        roleId,
      })
      .returning();

    if (!user || user.length === 0) {
      throw createError({ statusCode: 500, message: 'Could Not Create User' });
    }

    setResponseStatus(event, 201, 'User created');
    return data.user;
  } catch (err) {
    await client.auth.admin.deleteUser(data.user.id);
    handleError(event, err);
  }
});
