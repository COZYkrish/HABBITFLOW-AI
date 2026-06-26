import { ReminderQueue } from '../models/ReminderQueue';
import { HistoryEngine } from './history.engine';

export class SnoozeEngine {
  static async snooze(historyId: string, queueId: string | undefined, userId: string, minutes: number): Promise<void> {
    await HistoryEngine.markStatus(historyId, userId, 'snoozed');

    if (queueId) {
      const scheduledAt = new Date(Date.now() + minutes * 60_000);
      await ReminderQueue.findOneAndUpdate(
        { _id: queueId, userId },
        { $set: { scheduledAt, status: 'pending' } }
      );
    }
  }
}
