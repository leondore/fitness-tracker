import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import authRoutes from '~/server/authRoutes';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  try {
    const items = await db.query.stages.findMany({
      columns: {
        id: true,
        name: true,
      },
    });
    return items;
  } catch (err) {
    handleError(err);
  }
});
