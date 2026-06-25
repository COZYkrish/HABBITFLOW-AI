import { Router } from 'express';
import { AuthController } from './auth.controller';
import {
  validateRequest,
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validator';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/verify-email', validateRequest(verifyEmailSchema), AuthController.verifyEmail);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validateRequest(resetPasswordSchema), AuthController.resetPassword);

export default router;
