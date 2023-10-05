import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { stages, type Stages } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { name } = await readBody<Stages>(event);

  try {
    const created: Stages[] = await db
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
