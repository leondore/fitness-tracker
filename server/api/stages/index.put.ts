import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { stages, type Stage } from '~/db/schema';
import authRoutes from '~/server/authRoutes';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  const { id, name } = await readBody<Stage>(event);

  try {
    const updated: Stage[] = await db
      .update(stages)
      .set({ name, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(stages.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return updated;
  } catch (err) {
    handleError(event, err);
  }
});
