import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/preferences', NotificationsController.getPreferences);
router.patch('/preferences', NotificationsController.updatePreferences);

router.get('/history', NotificationsController.getHistory);
router.get('/upcoming', NotificationsController.getUpcoming);

router.post('/test', NotificationsController.testNotification);
router.post('/snooze', NotificationsController.snooze);
router.post('/mark-read', NotificationsController.markRead);
router.post('/mark-dispatched', NotificationsController.markDispatched);

export default router;
