import { Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { analyticsQuerySchema } from './analytics.validator';
import type { AuthRequest } from '../../middleware/auth.middleware';

const userId = (req: AuthRequest) => req.user!.id;

export class AnalyticsController {
  static async getOverview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = analyticsQuerySchema.parse(req.query);
      const data = await AnalyticsService.getOverview(userId(req), filters);
      res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
  }

  static async getHeatmap(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = analyticsQuerySchema.parse(req.query);
      const year = filters.year ? parseInt(filters.year, 10) : new Date().getFullYear();
      const data = await AnalyticsService.getHeatmap(userId(req), year);
      res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
  }

  static async getWeekly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = analyticsQuerySchema.parse(req.query);
      if (!filters.startDate || !filters.endDate) {
        throw new Error('startDate and endDate are required for weekly analytics');
      }
      const data = await AnalyticsService.getWeeklyAnalytics(userId(req), filters.startDate, filters.endDate);
      res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
  }

  static async getMonthly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = analyticsQuerySchema.parse(req.query);
      const year = filters.year ? parseInt(filters.year, 10) : new Date().getFullYear();
      const month = filters.month ? parseInt(filters.month, 10) : new Date().getMonth() + 1;
      const data = await AnalyticsService.getMonthlyAnalytics(userId(req), year, month);
      res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
  }

  static async getYearly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = analyticsQuerySchema.parse(req.query);
      const year = filters.year ? parseInt(filters.year, 10) : new Date().getFullYear();
      const data = await AnalyticsService.getYearlyAnalytics(userId(req), year);
      res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
  }

  static async getCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = analyticsQuerySchema.parse(req.query);
      const data = await AnalyticsService.getCategories(userId(req), filters);
      res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
  }

  static async getProductivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = analyticsQuerySchema.parse(req.query);
      const data = await AnalyticsService.getProductivity(userId(req), filters);
      res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
  }

  static async getStreaks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getStreaks(userId(req));
      res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
  }
}
