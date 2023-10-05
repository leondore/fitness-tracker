import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { muscleGroups, type MuscleGroups } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { id, name } = await readBody<MuscleGroups>(event);

  try {
    const updated: MuscleGroups[] = await db
      .update(muscleGroups)
      .set({ name, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(muscleGroups.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return updated;
  } catch (err) {
    handleError(err);
  }
});
