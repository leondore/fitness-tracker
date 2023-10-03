import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { muscleGroups, type MuscleGroups } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { name } = await readBody<MuscleGroups>(event);

  try {
    const created: Partial<MuscleGroups>[] = await db
      .insert(muscleGroups)
      .values({
        name,
      })
      .returning({ name: muscleGroups.name });

    setResponseStatus(event, 201, 'Created');
    return created;
  } catch (err) {
    handleError(err);
  }
});
