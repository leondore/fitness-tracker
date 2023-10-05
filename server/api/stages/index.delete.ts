import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { stages, type Stages } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { id } = await readBody<Stages>(event);

  try {
    const deleted: Stages[] = await db
      .delete(stages)
      .where(eq(stages.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return deleted;
  } catch (err) {
    handleError(err);
  }
});
