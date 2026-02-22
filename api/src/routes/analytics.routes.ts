import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export const analyticsRoutes = Router();

analyticsRoutes.use(authMiddleware);

function getStoreId(req: AuthRequest): string {
  const storeId = req.user?.storeId;
  if (!storeId) {
    throw new AppError(403, 'Store context required');
  }
  return storeId;
}

analyticsRoutes.get('/dashboard', async (req: AuthRequest, res) => {
  const storeId = getStoreId(req);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [
    totalRevenueResult,
    ordersTodayResult,
    allOrdersCount,
    abandonedCount,
    todayMetrics,
    revenueTrend,
    topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        storeId,
        status: { in: ['PAID', 'SHIPPED'] },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({
      where: {
        storeId,
        status: { in: ['PAID', 'SHIPPED'] },
        createdAt: { gte: today },
      },
    }),
    prisma.order.count({
      where: {
        storeId,
        status: { in: ['PAID', 'SHIPPED'] },
        createdAt: { gte: threeMonthsAgo },
      },
    }),
    prisma.order.count({
      where: {
        storeId,
        status: 'ABANDONED',
        createdAt: { gte: threeMonthsAgo },
      },
    }),
    prisma.dailyMetric.findUnique({
      where: {
        storeId_date: { storeId, date: today },
      },
    }),
    prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        storeId,
        status: { in: ['PAID', 'SHIPPED'] },
        createdAt: { gte: threeMonthsAgo },
      },
      _sum: { totalAmount: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          storeId,
          status: { in: ['PAID', 'SHIPPED'] },
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    }),
  ]);

  const totalRevenue = Number(totalRevenueResult._sum.totalAmount ?? 0);
  const totalOrders = allOrdersCount + abandonedCount;
  const conversionRate = totalOrders > 0 ? ((allOrdersCount / totalOrders) * 100).toFixed(2) : '0.00';
  const abandonedCartPercent =
    totalOrders > 0 ? ((abandonedCount / totalOrders) * 100).toFixed(2) : '0.00';

  const revenueByDate = new Map<string, number>();
  for (const r of revenueTrend) {
    const d = r.createdAt.toISOString().split('T')[0];
    revenueByDate.set(d, (revenueByDate.get(d) ?? 0) + Number(r._sum.totalAmount ?? 0));
  }
  const revenueTrendData = Array.from(revenueByDate.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, revenue]) => ({ date, revenue }));

  const productIds = topProducts.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p.name]));
  const topProductsData = topProducts.map((p) => ({
    productId: p.productId,
    productName: productMap.get(p.productId) ?? 'Unknown',
    quantitySold: p._sum.quantity ?? 0,
  }));

  const ordersByDate = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      storeId,
      status: { in: ['PAID', 'SHIPPED'] },
      createdAt: { gte: threeMonthsAgo },
    },
    _count: true,
  });
  const ordersByDateMap = new Map<string, number>();
  for (const o of ordersByDate) {
    const d = o.createdAt.toISOString().split('T')[0];
    ordersByDateMap.set(d, (ordersByDateMap.get(d) ?? 0) + o._count);
  }
  const ordersPerDayData = Array.from(ordersByDateMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  res.json({
    success: true,
    data: {
      totalRevenue,
      ordersToday: ordersTodayResult,
      conversionRate: parseFloat(conversionRate as string),
      abandonedCartPercent: parseFloat(abandonedCartPercent as string),
      revenueTrend: revenueTrendData,
      ordersPerDay: ordersPerDayData,
      topProducts: topProductsData,
    },
  });
});
