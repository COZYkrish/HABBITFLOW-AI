import { Habit } from '../../habit/models/Habit';
import { SchedulerEngine } from './scheduler.engine';
import { PreferenceEngine } from './preference.engine';
import { User } from '../../auth/models/User';

export class ReminderEngine {
  /**
   * Resyncs all habit reminders for a user.
   * This is called when a habit is created, updated, or when preferences change.
   */
  static async syncHabitReminders(userId: string): Promise<void> {
    const prefs = await PreferenceEngine.getPreferences(userId);
    if (!prefs.enabled) return;

    // In a full implementation, we'd clear existing pending queues for habits and recreate them.
    // For this Phase 10 demo, we'll assume the scheduler dynamically creates these or we just enqueue them.
  }

  /**
   * Generates a Daily Summary
   */
  static async scheduleDailySummary(userId: string): Promise<void> {
    const prefs = await PreferenceEngine.getPreferences(userId);
    if (!prefs.enabled || !prefs.dailyReminder) return;

    const user = await User.findById(userId).lean();
    if (!user) return;

    const streak = user.statistics?.currentStreak || 0;
    const body = `Your ${streak}-day streak is waiting. Ready to tackle today's habits?`;

    // Schedule for today at the specified time
    const [h, m] = prefs.dailyReminderTime.split(':').map(Number);
    const scheduledAt = new Date();
    scheduledAt.setHours(h, m, 0, 0);
    
    // If it's already past for today, schedule for tomorrow
    if (scheduledAt.getTime() < Date.now()) {
      scheduledAt.setDate(scheduledAt.getDate() + 1);
    }

    await SchedulerEngine.schedule(
      userId,
      'daily_summary',
      'Daily Reminder',
      body,
      scheduledAt,
      { streak },
      '☀️'
    );
  }
}
