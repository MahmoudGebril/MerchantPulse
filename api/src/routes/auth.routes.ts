import { Router } from 'express';
import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../dto/auth.dto.js';

export const authRoutes = Router();

authRoutes.post('/register', async (req, res) => {
  const dto = registerSchema.parse(req.body);
  const user = await authService.register(
    dto.name,
    dto.email,
    dto.password,
    dto.role,
    dto.storeId
  );
  res.status(201).json({ success: true, data: user });
});

authRoutes.post('/login', async (req, res) => {
  const dto = loginSchema.parse(req.body);
  const result = await authService.login(dto.email, dto.password);
  res.json({ success: true, data: result });
});
