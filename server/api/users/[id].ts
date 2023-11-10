import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import adminRoutes from '~/server/adminRoutes';
import { users } from '~/db/schema';

export default defineEventHandler(async (event) => {
  await adminRoutes(event);

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'No Id Provided' });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw createError({ statusCode: 404, message: 'No User Found' });
    }

    setResponseStatus(event, 200, 'OK');
    return user;
  } catch (err) {
    handleError(event, err);
  }
});
