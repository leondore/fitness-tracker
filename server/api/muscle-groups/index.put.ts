import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { muscleGroups, type MuscleGroups } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { id, name } = await readBody<MuscleGroups>(event);

  try {
    const updated: Partial<MuscleGroups>[] = await db
      .update(muscleGroups)
      .set({ name })
      .where(eq(muscleGroups.id, id))
      .returning({ id: muscleGroups.id, name: muscleGroups.name });

    setResponseStatus(event, 200, 'OK');
    return updated;
  } catch (err) {
    handleError(err);
  }
});
