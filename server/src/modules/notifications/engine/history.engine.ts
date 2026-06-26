import { NotificationHistory, INotificationHistory } from '../models/NotificationHistory';
import { NotificationType } from '../notifications.types';

export class HistoryEngine {
  static async logSent(userId: string, type: NotificationType, title: string, body: string, data?: any, icon?: string): Promise<INotificationHistory> {
    return NotificationHistory.create({
      userId,
      type,
      title,
      body,
      data,
      icon,
      status: 'sent',
    });
  }

  static async markStatus(id: string, userId: string, status: 'opened' | 'dismissed' | 'snoozed' | 'action_taken'): Promise<void> {
    await NotificationHistory.findOneAndUpdate({ _id: id, userId }, { $set: { status } });
  }

  static async getHistory(userId: string, limit: number = 50): Promise<INotificationHistory[]> {
    return NotificationHistory.find({ userId }).sort({ sentAt: -1 }).limit(limit).lean();
  }
}
