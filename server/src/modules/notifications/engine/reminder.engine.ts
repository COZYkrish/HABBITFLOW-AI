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

    const { ReminderQueue } = await import('../models/ReminderQueue');
    // Clear existing pending habit reminders for this user
    await ReminderQueue.deleteMany({ userId, type: 'habit_reminder', status: 'pending' });

    const { Habit } = await import('../../habit/models/Habit');
    const habits = await Habit.find({ userId, status: 'active', isArchived: false, isPaused: false }).lean();

    const now = new Date();

    for (const habit of habits) {
      if (habit.reminder?.enabled && habit.reminder?.time) {
        const [h, m] = habit.reminder.time.split(':').map(Number);
        const scheduledAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);

        if (scheduledAt.getTime() <= now.getTime()) {
          // If the time has already passed today, schedule for tomorrow
          scheduledAt.setDate(scheduledAt.getDate() + 1);
        }

        await SchedulerEngine.schedule(
          userId,
          'habit_reminder',
          habit.title,
          `Time to complete your habit: ${habit.title}`,
          scheduledAt,
          { habitId: habit._id.toString() },
          habit.icon || '🔔'
        );
      }
    }
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
