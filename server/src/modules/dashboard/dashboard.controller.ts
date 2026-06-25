import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  /**
   * GET /api/v1/dashboard/summary
   * Returns the full dashboard data payload for the authenticated user.
   */
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      // req.userId is injected by authenticate middleware from Phase 3
      const userId = (req as any).userId as string;
      const timezone = req.headers['x-timezone'] as string || 'UTC';
      const data = await DashboardService.getSummary(userId, timezone);

      res.status(200).json({
        success: true,
        message: 'Dashboard loaded successfully',
        data,
      });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }
}
