import morgan from 'morgan';
import { env } from '../config/env.js';

export const loggingMiddleware = morgan(
  env.isDev() ? 'dev' : 'combined'
);
