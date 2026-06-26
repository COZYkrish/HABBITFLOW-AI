import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/overview', AnalyticsController.getOverview);
router.get('/heatmap', AnalyticsController.getHeatmap);
router.get('/weekly', AnalyticsController.getWeekly);
router.get('/monthly', AnalyticsController.getMonthly);
router.get('/yearly', AnalyticsController.getYearly);
router.get('/categories', AnalyticsController.getCategories);
router.get('/productivity', AnalyticsController.getProductivity);
router.get('/streaks', AnalyticsController.getStreaks);

export default router;
