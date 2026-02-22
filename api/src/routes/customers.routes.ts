import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, requireRole, type AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export const customersRoutes = Router();

customersRoutes.use(authMiddleware);
customersRoutes.use(requireRole('ADMIN', 'SELLER', 'VIEWER'));

function getStoreId(req: AuthRequest): string {
  const storeId = req.user?.storeId;
  if (!storeId) {
    throw new AppError(403, 'Store context required');
  }
  return storeId;
}

customersRoutes.get('/', async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const customers = await prisma.customer.findMany({
    where: { storeId },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });
  res.json({ success: true, data: customers });
});
