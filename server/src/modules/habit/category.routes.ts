import { Router } from 'express';
import { HabitController } from '../habit/habit.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import type { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);
router.get('/', (req, res, next) => HabitController.getCategories(req as AuthRequest, res, next));

export default router;
