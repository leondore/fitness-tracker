import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { stages, type Stage } from '~/db/schema';
import authRoutes from '~/server/authRoutes';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  const { id } = await readBody<Stage>(event);

  try {
    const deleted: Stage[] = await db
      .delete(stages)
      .where(eq(stages.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return deleted;
  } catch (err) {
    handleError(err);
  }
});
