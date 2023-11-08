import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import adminRoutes from '~/server/adminRoutes';

export default defineEventHandler(async (event) => {
  await adminRoutes(event);

  try {
    const items = await db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roleId: true,
      },
    });
    return items;
  } catch (err) {
    handleError(event, err);
  }
});
