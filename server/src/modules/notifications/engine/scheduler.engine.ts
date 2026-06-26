import { ReminderQueue, IReminderQueue } from '../models/ReminderQueue';
import { PreferenceEngine } from './preference.engine';

export class SchedulerEngine {
  /**
   * Enqueues a notification to be sent at a specific time.
   */
  static async schedule(
    userId: string,
    type: string,
    title: string,
    body: string,
    scheduledAt: Date,
    data?: any,
    icon?: string
  ): Promise<IReminderQueue> {
    return ReminderQueue.create({
      userId,
      type,
      title,
      body,
      scheduledAt,
      data,
      icon,
    });
  }

  /**
   * Called periodically (e.g. cron or interval) to process due items in the queue.
   * Due to phase 10 requirements we are processing via the browser, but this acts 
   * as the backend queue if we were to push them out (e.g. web push, FCM).
   * For Phase 10 Browser Notifications, the frontend will actually poll `/upcoming` 
   * and fire local notifications, but we keep this queue architecture ready for Push.
   */
  static async getUpcoming(userId: string): Promise<IReminderQueue[]> {
    const prefs = await PreferenceEngine.getPreferences(userId);
    
    if (!prefs.enabled) {
      return [];
    }

    const now = new Date();
    
    // We fetch pending reminders that are due within the next 24 hours
    // or already past due (and not yet processed)
    const endWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcoming = await ReminderQueue.find({
      userId,
      status: 'pending',
      scheduledAt: { $lte: endWindow }
    }).sort({ scheduledAt: 1 }).lean();

    // Filter out ones that fall in quiet hours if quiet hours are enabled
    return upcoming.filter((item) => {
      // If it's already due, and we are currently in quiet hours, we might defer it
      if (item.scheduledAt <= now && PreferenceEngine.isQuietHours(prefs, now)) {
        return false;
      }
      return true;
    });
  }

  static async markProcessed(queueId: string): Promise<void> {
    await ReminderQueue.findByIdAndUpdate(queueId, { $set: { status: 'processing' } });
  }
}
