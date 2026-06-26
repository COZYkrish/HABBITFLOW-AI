import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/weekly', ReportsController.getWeekly);
router.get('/monthly', ReportsController.getMonthly);
router.get('/yearly', ReportsController.getYearly);

router.post('/export/pdf', ReportsController.exportPdf);
router.post('/export/csv', ReportsController.exportCsv);
router.post('/export/json', ReportsController.exportJson);

export { router as reportsRouter };
