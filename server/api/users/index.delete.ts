import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import authRoutes from '~/server/authRoutes';
import { users, type User } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Cookie');
  await authRoutes(event);

  const { id } = await readBody<User>(event);

  try {
    const deleted: User[] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return deleted;
  } catch (err) {
    handleError(err);
  }
});
