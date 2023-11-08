import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { muscleGroups, type MuscleGroup } from '~/db/schema';
import authRoutes from '~/server/authRoutes';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  const { id, name } = await readBody<MuscleGroup>(event);

  try {
    const updated: MuscleGroup[] = await db
      .update(muscleGroups)
      .set({ name, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(muscleGroups.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return updated;
  } catch (err) {
    handleError(event, err);
  }
});
