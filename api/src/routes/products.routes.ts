import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, requireRole, type AuthRequest } from '../middleware/auth.js';
import { createProductSchema, updateProductSchema } from '../dto/product.dto.js';
import { AppError } from '../middleware/errorHandler.js';

export const productsRoutes = Router();

productsRoutes.use(authMiddleware);
productsRoutes.use(requireRole('ADMIN', 'SELLER', 'VIEWER'));

function getStoreId(req: AuthRequest): string {
  const storeId = req.user?.storeId;
  if (!storeId) {
    throw new AppError(403, 'Store context required');
  }
  return storeId;
}

productsRoutes.get('/', async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const products = await prisma.product.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: products });
});

productsRoutes.get('/:id', async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const id = String(req.params.id);
  const product = await prisma.product.findFirst({
    where: { id, storeId },
  });
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  res.json({ success: true, data: product });
});

productsRoutes.post('/', requireRole('ADMIN', 'SELLER'), async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const dto = createProductSchema.parse(req.body);
  const product = await prisma.product.create({
    data: {
      storeId,
      ...dto,
    },
  });
  res.status(201).json({ success: true, data: product });
});

productsRoutes.patch('/:id', requireRole('ADMIN', 'SELLER'), async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const id = String(req.params.id);
  const dto = updateProductSchema.parse(req.body);
  const product = await prisma.product.findFirst({
    where: { id, storeId },
  });
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  const updated = await prisma.product.update({
    where: { id },
    data: dto,
  });
  res.json({ success: true, data: updated });
});

productsRoutes.delete('/:id', requireRole('ADMIN', 'SELLER'), async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const id = String(req.params.id);
  const product = await prisma.product.findFirst({
    where: { id, storeId },
  });
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  await prisma.product.delete({
    where: { id },
  });
  res.json({ success: true, message: 'Product deleted' });
});
