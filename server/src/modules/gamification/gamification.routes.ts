import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import * as controller from './gamification.controller';

const router = Router();

router.use(requireAuth);

router.get('/profile', controller.getProfile);
router.get('/achievements', controller.getAchievements);
router.get('/challenges', controller.getChallenges);
router.get('/daily-goal', controller.getDailyGoal);
router.post('/recalculate', controller.recalculateXP);

export default router;
