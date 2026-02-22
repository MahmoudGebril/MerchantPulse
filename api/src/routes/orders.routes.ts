import { Router } from 'express';
import type { OrderStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, requireRole, type AuthRequest } from '../middleware/auth.js';
import { createOrderSchema, updateOrderSchema } from '../dto/order.dto.js';
import { AppError } from '../middleware/errorHandler.js';

export const ordersRoutes = Router();

ordersRoutes.use(authMiddleware);
ordersRoutes.use(requireRole('ADMIN', 'SELLER', 'VIEWER'));

function getStoreId(req: AuthRequest): string {
  const storeId = req.user?.storeId;
  if (!storeId) {
    throw new AppError(403, 'Store context required');
  }
  return storeId;
}

ordersRoutes.get('/', async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const status = req.query.status;
  const statusVal = typeof status === 'string' ? (status as OrderStatus) : undefined;
  const where = statusVal ? { storeId, status: statusVal } : { storeId };

  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: true,
      orderItems: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json({ success: true, data: orders });
});

ordersRoutes.get('/:id', async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const id = String(req.params.id);
  const order = await prisma.order.findFirst({
    where: { id, storeId },
    include: {
      customer: true,
      orderItems: { include: { product: true } },
    },
  });
  if (!order) {
    throw new AppError(404, 'Order not found');
  }
  res.json({ success: true, data: order });
});

ordersRoutes.post('/', requireRole('ADMIN', 'SELLER'), async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const dto = createOrderSchema.parse(req.body);

  const customer = await prisma.customer.findFirst({
    where: { id: dto.customerId, storeId },
  });
  if (!customer) {
    throw new AppError(404, 'Customer not found');
  }

  const order = await prisma.$transaction(async (tx: import('@prisma/client').Prisma.TransactionClient) => {
    const order = await tx.order.create({
      data: {
        storeId,
        customerId: dto.customerId,
        status: dto.status,
        subtotal: dto.subtotal,
        discountAmount: dto.discountAmount,
        totalAmount: dto.totalAmount,
      },
    });
    await tx.orderItem.createMany({
      data: dto.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
    });
    return tx.order.findUniqueOrThrow({
      where: { id: order.id },
      include: {
        customer: true,
        orderItems: { include: { product: true } },
      },
    });
  });

  res.status(201).json({ success: true, data: order });
});

ordersRoutes.patch('/:id', requireRole('ADMIN', 'SELLER'), async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const id = String(req.params.id);
  const dto = updateOrderSchema.parse(req.body);
  const order = await prisma.order.findFirst({
    where: { id, storeId },
  });
  if (!order) {
    throw new AppError(404, 'Order not found');
  }
  const updated = await prisma.order.update({
    where: { id },
    data: dto,
    include: {
      customer: true,
      orderItems: { include: { product: true } },
    },
  });
  res.json({ success: true, data: updated });
});

ordersRoutes.delete('/:id', requireRole('ADMIN', 'SELLER'), async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const id = String(req.params.id);
  const order = await prisma.order.findFirst({
    where: { id, storeId },
  });
  if (!order) {
    throw new AppError(404, 'Order not found');
  }
  await prisma.order.delete({
    where: { id },
  });
  res.json({ success: true, message: 'Order deleted' });
});
