import { Router } from 'express';
import { InsightsController } from './insights.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

// Since we condensed all insights into one powerful overview orchestrator
// We can just expose /overview for now, which the frontend will use to power the entire dashboard & insights page
router.get('/overview', InsightsController.getOverview);

export default router;
