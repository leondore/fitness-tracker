import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import authRoutes from '~/server/authRoutes';
import { muscleGroups, type MuscleGroup } from '~/db/schema';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  const { id } = await readBody<MuscleGroup>(event);

  try {
    const deleted: MuscleGroup[] = await db
      .delete(muscleGroups)
      .where(eq(muscleGroups.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return deleted;
  } catch (err) {
    handleError(err);
  }
});
