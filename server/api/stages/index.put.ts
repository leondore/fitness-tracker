import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { stages, type Stages } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { id, name } = await readBody<Stages>(event);

  try {
    const updated: Stages[] = await db
      .update(stages)
      .set({ name, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(stages.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return updated;
  } catch (err) {
    handleError(err);
  }
});
