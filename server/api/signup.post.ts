import { db } from '../utils/db';
import { handleError } from '../utils/helpers';
import { users } from '~/db/schema';
import { Role } from '~/types/auth';
import { serverSupabaseServiceRole } from '#supabase/server';

interface SignUpBody {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}

export default defineEventHandler(async (event) => {
  const { email, password, firstName, lastName, phone } =
    await readBody<SignUpBody>(event);

  const client = serverSupabaseServiceRole(event);

  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      phone,
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
      phone,
      roleId: Role.Member,
    });

    setResponseStatus(event, 201, 'User created');
    return data.user;
  } catch (err) {
    await client.auth.admin.deleteUser(data.user.id);
    handleError(err);
  }
});
