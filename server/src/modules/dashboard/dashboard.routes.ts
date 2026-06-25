import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

/** GET /api/v1/dashboard/summary — Authenticated */
router.get('/summary', requireAuth, (req, res, next) => {
  // Map req.user.id → req.userId for consistent controller API
  (req as any).userId = (req as any).user?.id;
  return DashboardController.getSummary(req, res, next);
});

export default router;
