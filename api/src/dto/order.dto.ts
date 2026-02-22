import { z } from 'zod';

export const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'ABANDONED']),
  subtotal: z.number().nonnegative(),
  discountAmount: z.number().nonnegative().optional().default(0),
  totalAmount: z.number().nonnegative(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      priceAtPurchase: z.number().nonnegative(),
    })
  ),
});

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'ABANDONED']).optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
