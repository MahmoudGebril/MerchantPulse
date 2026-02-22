import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { loggingMiddleware } from './middleware/logging.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.routes.js';
import { storeRoutes } from './routes/store.routes.js';
import { productsRoutes } from './routes/products.routes.js';
import { ordersRoutes } from './routes/orders.routes.js';
import { analyticsRoutes } from './routes/analytics.routes.js';
import { customersRoutes } from './routes/customers.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(loggingMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customersRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  if (env.isDev()) {
    // eslint-disable-next-line no-console
    console.log(`MerchantPulse API running at http://localhost:${env.PORT}`);
  }
});
