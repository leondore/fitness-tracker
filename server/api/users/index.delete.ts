import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { users, type User } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { id } = await readBody<User>(event);

  try {
    let token: string | undefined;
    const TOKEN_KEY = 'sb-access-token=';
    const cookies = getHeader(event, 'Cookie');
    const tokenKeyIdx = cookies?.indexOf(TOKEN_KEY);
    if (typeof tokenKeyIdx === 'number' && tokenKeyIdx > -1) {
      const tokenKey = cookies?.substring(tokenKeyIdx + TOKEN_KEY.length);
      token = tokenKey?.substring(0, tokenKey.indexOf(';'));
    }

    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }
    // const deleted: User[] = await db
    //   .delete(users)
    //   .where(eq(users.id, id))
    //   .returning();

    setResponseStatus(event, 200, 'OK');
    return { token };
  } catch (err) {
    handleError(err);
  }
});
