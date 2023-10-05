import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { muscleGroups, type MuscleGroup } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { name } = await readBody<MuscleGroup>(event);

  try {
    const created: MuscleGroup[] = await db
      .insert(muscleGroups)
      .values({
        name,
      })
      .returning();

    setResponseStatus(event, 201, 'Created');
    return created;
  } catch (err) {
    handleError(err);
  }
});
