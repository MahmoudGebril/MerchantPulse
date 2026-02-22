import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export const storeRoutes = Router();

storeRoutes.use(authMiddleware);

storeRoutes.get('/me', async (req: AuthRequest, res) => {
  const storeId = req.user?.storeId;
  if (!storeId) {
    throw new AppError(404, 'No store associated with this user');
  }
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: {
      id: true,
      name: true,
      slug: true,
      brandPrimaryColor: true,
      brandLogoUrl: true,
      currency: true,
      timezone: true,
    },
  });
  if (!store) {
    throw new AppError(404, 'Store not found');
  }
  res.json({ success: true, data: store });
});
