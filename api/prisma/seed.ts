import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

// Middle Eastern names for customers and admin
const ADMIN_USER = {
  name: 'Omar Al-Hassan',
  email: 'admin@merchantpulse.demo',
  password: 'Admin123!',
};

const CUSTOMER_NAMES = [
  'Fatima Al-Rashid',
  'Youssef Ibrahim',
  'Layla Mohammed',
  'Ahmad Khalil',
  'Noor Abdullah',
  'Hassan Mahmoud',
  'Sara Hussein',
  'Tariq Farouk',
  'Mariam Said',
  'Khalid Nasir',
  'Zainab Omar',
  'Rashid Jamal',
  'Aisha Mustafa',
  'Faisal Rami',
  'Nadia Karim',
  'Bilal Samir',
  'Hala Tariq',
  'Amir Yusuf',
  'Dina Farid',
  'Omar Zahir',
  'Lina Waleed',
  'Karim Bassam',
  'Yasmin Nabil',
  'Tarek Riad',
  'Huda Adnan',
  'Sami Fawzi',
  'Rania Jamila',
  'Nasser Kareem',
  'Salma Rafiq',
  'Walid Hamza',
  'Leila Kamal',
  'Majid Zaki',
  'Dalia Fadi',
  'Ibrahim Sami',
  'Nada Hisham',
  'Adel Younis',
  'Mona Rania',
  'Fadi Hani',
  'Reem Tarek',
  'Bassam Nabil',
  'Amira Khalil',
  'Yasin Rafiq',
  'Layla Fawzi',
  'Wassim Jamal',
  'Hanan Said',
  'Tariq Samir',
  'Dina Karim',
  'Nabil Rashid',
  'Sanaa Omar',
  'Faisal Hassan',
];

const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Books',
  'Toys',
  'Food & Beverage',
];

const PRODUCT_NAMES = [
  'Wireless Bluetooth Earbuds',
  'Organic Cotton T-Shirt',
  'Stainless Steel Water Bottle',
  'Yoga Mat Premium',
  'Natural Face Serum',
  'Smart Fitness Tracker',
  'Leather Wallet Classic',
  'Ceramic Coffee Mug Set',
  'Portable Phone Charger',
  'Running Shoes Pro',
  'Essential Oil Diffuser',
  'Bamboo Cutting Board',
  'LED Desk Lamp',
  'Cotton Bed Sheets Set',
  'Handcrafted Soap Collection',
  'Wireless Mouse Ergonomic',
  'Canvas Backpack',
  'Herbal Tea Sampler',
  'Resistance Bands Set',
  'Skincare Moisturizer',
  'Wooden Phone Stand',
  'Scented Candle Gift Set',
  'Meal Prep Containers',
  'Noise Cancelling Headphones',
  'Aloe Vera Gel',
  'Insulated Lunch Bag',
  'Desk Organizer Set',
  'Natural Hair Oil',
  'Foam Roller',
  'Reusable Shopping Bags',
  'Bluetooth Speaker Mini',
  'Silk Sleep Mask',
  'Spice Rack Organizer',
  'Collagen Supplement',
  'Laptop Stand',
  'Coconut Oil Body Lotion',
  'Hiking Waterproof Jacket',
  'Matcha Green Tea',
  'Resistance Loop Bands',
  'Rose Water Toner',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data (order matters for FK)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dailyMetric.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();

  // 1. Create demo store
  const store = await prisma.store.create({
    data: {
      name: 'Souq Al-Noor',
      slug: 'souq-al-noor',
      brandPrimaryColor: '#4F46E5',
      brandLogoUrl: null,
      currency: 'AED',
      timezone: 'Asia/Dubai',
    },
  });
  console.log('✓ Created store:', store.name);

  // 2. Create admin user
  const passwordHash = await bcrypt.hash(ADMIN_USER.password, SALT_ROUNDS);
  const admin = await prisma.user.create({
    data: {
      name: ADMIN_USER.name,
      email: ADMIN_USER.email,
      passwordHash,
      role: 'ADMIN',
      storeId: store.id,
    },
  });
  console.log('✓ Created admin user:', admin.email);

  // 3. Create 40 products
  const products: { id: string; price: number; category: string }[] = [];
  for (let i = 0; i < 40; i++) {
    const price = randomInt(15, 250);
    const costPrice = Math.round(price * (0.3 + Math.random() * 0.4));
    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name: PRODUCT_NAMES[i] ?? `Product ${i + 1}`,
        description: `Premium quality ${PRODUCT_NAMES[i]?.toLowerCase() ?? 'product'}`,
        category: randomElement(PRODUCT_CATEGORIES),
        price,
        costPrice,
        stockQuantity: randomInt(10, 500),
        isActive: true,
      },
    });
    products.push({
      id: product.id,
      price: Number(product.price),
      category: product.category,
    });
  }
  console.log('✓ Created 40 products');

  // 4. Create 50 customers
  const customers: { id: string }[] = [];
  for (let i = 0; i < 50; i++) {
    const name = CUSTOMER_NAMES[i] ?? `Customer ${i + 1}`;
    const customer = await prisma.customer.create({
      data: {
        storeId: store.id,
        name,
        email: `customer${i + 1}@example.com`,
        phone: `+9715${randomInt(50000000, 99999999)}`,
      },
    });
    customers.push({ id: customer.id });
  }
  console.log('✓ Created 50 customers');

  // 5. Create 300 orders across 3 months (20% abandoned)
  const threeMonthsAgo = addDays(new Date(), -90);
  const orderStatuses: ('PAID' | 'SHIPPED' | 'ABANDONED')[] = [
    ...Array(120).fill('PAID'),
    ...Array(120).fill('SHIPPED'),
    ...Array(60).fill('ABANDONED'),
  ];
  // Shuffle
  for (let i = orderStatuses.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [orderStatuses[i], orderStatuses[j]] = [orderStatuses[j], orderStatuses[i]];
  }

  const dailyMetricsMap = new Map<string, { orders: number; revenue: number; abandoned: number }>();

  for (let i = 0; i < 300; i++) {
    const orderDate = addDays(threeMonthsAgo, randomInt(0, 89));
    const customer = randomElement(customers);
    const numItems = randomInt(1, 4);
    const selectedProducts = Array.from({ length: numItems }, () => randomElement(products));
    const items = selectedProducts.map((p) => ({
      productId: p.id,
      quantity: randomInt(1, 3),
      priceAtPurchase: p.price,
    }));
    const subtotal = items.reduce((sum, it) => sum + it.quantity * it.priceAtPurchase, 0);
    const discountAmount = randomInt(0, 3) === 0 ? randomInt(5, 20) : 0;
    const totalAmount = Math.max(0, subtotal - discountAmount);
    const status = orderStatuses[i];

    const order = await prisma.order.create({
      data: {
        storeId: store.id,
        customerId: customer.id,
        status,
        subtotal,
        discountAmount,
        totalAmount,
        createdAt: orderDate,
        updatedAt: orderDate,
      },
    });

    await prisma.orderItem.createMany({
      data: items.map((it) => ({
        orderId: order.id,
        productId: it.productId,
        quantity: it.quantity,
        priceAtPurchase: it.priceAtPurchase,
      })),
    });

    const dateKey = orderDate.toISOString().split('T')[0];
    const existing = dailyMetricsMap.get(dateKey) ?? { orders: 0, revenue: 0, abandoned: 0 };
    existing.orders += 1;
    if (status !== 'ABANDONED') {
      existing.revenue += totalAmount;
    } else {
      existing.abandoned += 1;
    }
    dailyMetricsMap.set(dateKey, existing);
  }
  console.log('✓ Created 300 orders (240 completed, 60 abandoned)');

  // 6. Create DailyMetric records
  for (const [dateStr, metrics] of dailyMetricsMap) {
    const totalOrders = metrics.orders;
    const conversionRate = totalOrders > 0 ? ((totalOrders - metrics.abandoned) / totalOrders) * 100 : 0;
    await prisma.dailyMetric.create({
      data: {
        storeId: store.id,
        date: new Date(dateStr),
        totalOrders: totalOrders - metrics.abandoned,
        totalRevenue: metrics.revenue,
        abandonedCarts: metrics.abandoned,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
    });
  }
  console.log('✓ Created daily metrics');

  console.log('\n✅ Seed completed successfully!');
  console.log('   Admin login: admin@merchantpulse.demo / Admin123!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
