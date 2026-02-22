# MerchantPulse

Full-stack Ionic + Angular 20 SaaS mobile analytics platform for e-commerce sellers. Multi-tenant white-label architecture with signals, RxJS, GSAP animations, JWT auth, and PostgreSQL backend.

## Architecture

```
MerchantPulse/
├── api/                    # Node.js + Express backend
│   ├── prisma/             # Schema, migrations, seed
│   ├── src/
│   │   ├── config/         # Environment config
│   │   ├── dto/            # Zod validation schemas
│   │   ├── lib/            # Prisma client
│   │   ├── middleware/     # Auth, error handling, logging
│   │   ├── routes/         # Auth, store, products, orders, analytics, customers
│   │   └── services/       # Auth service
│   └── ...
├── mobile/                 # Ionic + Angular 20 app
│   └── src/app/
│       ├── auth/           # Login, guards
│       ├── core/           # Shared config
│       ├── dashboard/      # KPI cards, charts
│       ├── layout/         # Tabs layout
│       ├── models/         # TypeScript interfaces
│       ├── orders/         # Orders list & detail
│       ├── products/       # Products list & detail
│       ├── services/       # API, Dashboard store
│       ├── settings/       # Settings, theme toggle
│       └── theme/          # White-label ThemeService
└── README.md
```

## Tech Stack

### Frontend
- **Ionic 8** + **Angular 20**
- Standalone components only
- Signals for state (`computed()`, `effect()`)
- RxJS for API streams
- `takeUntilDestroyed` for subscription cleanup
- GSAP for animations
- Chart.js for dashboard charts
- Lazy-loaded routes
- JWT auth interceptor
- White-label ThemeService (primary color, logo, dark mode)

### Backend
- **Node.js** + **Express**
- **PostgreSQL** + **Prisma ORM**
- JWT authentication
- Role-based access (ADMIN, SELLER, VIEWER)
- Centralized error handler
- Logging middleware (Morgan)
- Zod DTO validation

## Database Schema

- **User** – id, name, email, passwordHash, role, storeId
- **Store** – id, name, slug, brandPrimaryColor, brandLogoUrl, currency, timezone
- **Product** – id, storeId, name, description, category, price, costPrice, stockQuantity, isActive
- **Customer** – id, storeId, name, email, phone
- **Order** – id, storeId, customerId, status, subtotal, discountAmount, totalAmount
- **OrderItem** – id, orderId, productId, quantity, priceAtPurchase
- **DailyMetric** – id, storeId, date, totalOrders, totalRevenue, abandonedCarts, conversionRate

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or pnpm

### 1. Backend

```bash
cd api
cp .env.example .env
# Edit .env: set DATABASE_URL and JWT_SECRET

npm install
npx prisma generate
npx prisma db push
npm run db:seed

npm run dev
```

API runs at `http://localhost:3000`

### 2. Mobile App

```bash
cd mobile
npm install
npm start
```

App runs at `http://localhost:4200` with API proxy to backend.

### Demo Credentials
- **Email:** admin@merchantpulse.demo
- **Password:** Admin123!

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/store/me` | Current store (auth) |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/products` | Create product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | List orders |
| GET | `/api/orders/:id` | Order detail |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/customers` | List customers |
| GET | `/api/analytics/dashboard` | Dashboard KPIs & charts |

## White-Label Theme

The `ThemeService` supports:
- Dynamic primary color
- Dynamic accent color
- Custom logo URL
- Store name
- Light/Dark mode toggle

Theme is applied globally via CSS variables (`--brand-primary`, `--brand-accent`, etc.).

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure `DATABASE_URL` and `JWT_SECRET`
3. Build API: `cd api && npm run build && npm start`
4. Build mobile: `cd mobile && npm run build`
5. Serve `mobile/dist/mobile` or use Capacitor for native apps

## License

MIT
