import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { muscleGroups, type MuscleGroups } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { id } = await readBody<MuscleGroups>(event);

  try {
    const deleted: MuscleGroups[] = await db
      .delete(muscleGroups)
      .where(eq(muscleGroups.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return deleted;
  } catch (err) {
    handleError(err);
  }
});
