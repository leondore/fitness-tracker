import adminRoutes from '../adminRoutes';
import { users, type UserSignup } from '~/db/schema';
import { Role } from '~/types/auth';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  await adminRoutes(event);

  const { email, password, firstName, lastName } =
    await readBody<UserSignup>(event);

  const client = serverSupabaseServiceRole(event);

  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
    },
    app_metadata: {
      role: Role.Member,
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
    await db.insert(users).values({
      id: data.user.id,
      email,
      firstName,
      lastName,
      roleId: Role.Member,
    });

    setResponseStatus(event, 201, 'User created');
    return { user: data.user };
  } catch (err) {
    await client.auth.admin.deleteUser(data.user.id);
    handleError(event, err);
  }
});
