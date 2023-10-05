import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { stages, type Stage } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { name } = await readBody<Stage>(event);

  try {
    const created: Stage[] = await db
      .insert(stages)
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
