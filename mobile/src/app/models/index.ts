export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'VIEWER';
  storeId: string | null;
  store?: Store;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  brandPrimaryColor: string;
  brandLogoUrl: string | null;
  currency: string;
  timezone: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  costPrice: number | null;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED' | 'ABANDONED';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product?: Product;
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  orderItems?: OrderItem[];
}

export interface DashboardAnalytics {
  totalRevenue: number;
  ordersToday: number;
  conversionRate: number;
  abandonedCartPercent: number;
  revenueTrend: { date: string; revenue: number }[];
  ordersPerDay: { date: string; count: number }[];
  topProducts: { productId: string; productName: string; quantitySold: number }[];
}
