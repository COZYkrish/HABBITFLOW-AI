import { HistoryEngine } from './history.engine';
import { ReminderQueue } from '../models/ReminderQueue';

export class NotificationEngine {
  /**
   * Dispatches a notification to the client.
   * In a real app with FCM/WebPush, this would construct the payload and call Google's API.
   * For Phase 10 Browser Notifications via polling, we mark the queue as processed
   * and log it in the history so the client can fetch it via /upcoming and display it.
   */
  static async dispatch(queueId: string, userId: string, type: any, title: string, body: string, data?: any, icon?: string): Promise<void> {
    // Log to history
    await HistoryEngine.logSent(userId, type, title, body, data, icon);
    
    // Remove from queue or mark processed
    await ReminderQueue.findByIdAndDelete(queueId);
  }
}
