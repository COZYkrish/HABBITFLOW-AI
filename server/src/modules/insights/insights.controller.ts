import { Request, Response } from 'express';
import { InsightsService } from './insights.service';

export class InsightsController {
  static async getOverview(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const data = await InsightsService.getOverview(userId);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error: any) {
      console.error('Insights getOverview Error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate insights', error: error.message });
    }
  }
}
