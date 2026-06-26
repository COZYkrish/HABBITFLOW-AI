import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { NotificationEngine } from './engine/notification.engine';

export class NotificationsController {
  static async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await NotificationsService.getPreferences(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await NotificationsService.updatePreferences(userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await NotificationsService.getHistory(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async getUpcoming(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await NotificationsService.getUpcoming(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async testNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await NotificationsService.testNotification(userId);
      res.status(200).json({ success: true, message: 'Test notification queued' });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async snooze(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { historyId, queueId, minutes } = req.body;
      await NotificationsService.snooze(historyId, queueId, userId, minutes);
      res.status(200).json({ success: true, message: 'Snoozed successfully' });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { historyId } = req.body;
      await NotificationsService.markRead(historyId, userId);
      res.status(200).json({ success: true, message: 'Marked read' });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }
  
  static async markDispatched(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { queueId, type, title, body, data, icon } = req.body;
      
      // When the client polls and shows a notification, it calls this to mark it sent
      await NotificationEngine.dispatch(queueId, userId, type, title, body, data, icon);
      
      res.status(200).json({ success: true });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }
}
