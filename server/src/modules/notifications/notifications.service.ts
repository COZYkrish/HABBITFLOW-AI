import { PreferenceEngine } from './engine/preference.engine';
import { HistoryEngine } from './engine/history.engine';
import { SchedulerEngine } from './engine/scheduler.engine';
import { NotificationEngine } from './engine/notification.engine';
import { SnoozeEngine } from './engine/snooze.engine';
import { ReminderEngine } from './engine/reminder.engine';
import { NotificationPreferencesDTO } from './notifications.types';

export class NotificationsService {
  static async getPreferences(userId: string) {
    return PreferenceEngine.getPreferences(userId);
  }

  static async updatePreferences(userId: string, updates: Partial<NotificationPreferencesDTO>) {
    const prefs = await PreferenceEngine.updatePreferences(userId, updates);
    // When prefs change, we should resync reminders
    await ReminderEngine.syncHabitReminders(userId);
    return prefs;
  }

  static async getHistory(userId: string) {
    return HistoryEngine.getHistory(userId);
  }

  static async getUpcoming(userId: string) {
    return SchedulerEngine.getUpcoming(userId);
  }

  static async snooze(historyId: string, queueId: string | undefined, userId: string, minutes: number) {
    return SnoozeEngine.snooze(historyId, queueId, userId, minutes);
  }

  static async markRead(historyId: string, userId: string) {
    return HistoryEngine.markStatus(historyId, userId, 'opened');
  }

  static async testNotification(userId: string) {
    // Generate a test notification immediately
    await SchedulerEngine.schedule(
      userId,
      'achievement',
      'Test Notification',
      'This is a test notification to verify your browser setup.',
      new Date(), // Due now
      {},
      '🔔'
    );
  }
}
