import { User } from '../auth/models/User';
import { Habit } from '../habit/models/Habit';
import { HabitLog } from '../habit/models/HabitLog';
import type {
  DashboardSummary,
  TodayHabit,
  ActivityItem,
  WeeklySummary,
  UpcomingReminder,
} from './dashboard.types';

/**
 * DashboardService
 * Assembles the dashboard summary for an authenticated user.
 * Now powered by real Habit and HabitLog data (Phase 5+).
 */
export class DashboardService {
  static async getSummary(userId: string, timezone: string = 'UTC'): Promise<DashboardSummary> {
    const user = await User.findById(userId).lean();
    if (!user) throw new Error('User not found');

    const today = new Date().toLocaleDateString('en-CA', { timeZone: timezone }); // YYYY-MM-DD

    // Fetch in parallel for performance
    const [
      activeHabits,
      todayLogs,
      recentLogs,
      weeklyLogs,
    ] = await Promise.all([
      Habit.find({ userId, status: 'active', deletedAt: null }).lean(),
      HabitLog.find({ userId, date: today }).lean(),
      HabitLog.find({ userId }).sort({ createdAt: -1 }).limit(20).populate('habitId', 'title icon category').lean(),
      DashboardService.getWeeklyLogs(userId, timezone),
    ]);

    // ── Today's habits ───────────────────────────────────────────────────────
    const completedToday = new Set(todayLogs.filter((l) => l.completed).map((l) => String(l.habitId)));

    const todayHabits: TodayHabit[] = activeHabits
      .filter((h) => DashboardService.isScheduledToday(h.repeatSchedule, timezone))
      .map((h) => ({
        id: String(h._id),
        name: h.title,
        category: h.category,
        icon: h.icon,
        estimatedMinutes: h.estimatedDuration,
        status: completedToday.has(String(h._id)) ? 'completed' : 'pending',
        priority: h.priority as TodayHabit['priority'],
      }));

    // ── Recent activity ────────────────────────────────────────────────────
    const recentActivity: ActivityItem[] = recentLogs
      .filter((l) => l.habitId)
      .slice(0, 8)
      .map((l) => {
        const habit = l.habitId as any;
        return {
          id: String(l._id),
          description: l.completed
            ? `Completed ${habit?.title ?? 'habit'}`
            : `Skipped ${habit?.title ?? 'habit'}`,
          type: l.completed ? 'completed' : 'skipped',
          timestamp: (l.createdAt as Date).toISOString(),
        };
      });

    // ── Streaks & productivity ─────────────────────────────────────────────
    let currentStreak = user.statistics?.currentStreak ?? 0;
    const bestStreak = user.statistics?.longestStreak ?? 0;

    // Dynamic streak break check:
    // If lastCompletedAt exists and it is before yesterday (in the user's timezone), the streak is broken.
    if (currentStreak > 0 && user.statistics?.lastCompletedAt) {
      const lastCompleted = new Date(user.statistics.lastCompletedAt).toLocaleDateString('en-CA', { timeZone: timezone });
      
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toLocaleDateString('en-CA', { timeZone: timezone });

      // If last completed date is strictly before yesterday, the streak is lost.
      if (lastCompleted < yesterday) {
        currentStreak = 0;
      }
    }

    // ── Weekly summary ─────────────────────────────────────────────────────
    const weeklySummary = DashboardService.buildWeeklySummary(weeklyLogs, activeHabits.length, currentStreak, timezone);
    const productivityScore = DashboardService.computeProductivityScore(
      todayHabits.filter((h) => h.status === 'completed').length,
      todayHabits.length
    );

    return {
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      todayHabits,
      currentStreak,
      bestStreak,
      productivityScore,
      recentActivity,
      weeklySummary,
      upcomingReminders: DashboardService.getUpcomingReminders(activeHabits, timezone),
    };
  }

  // ── Private helpers ─────────────────────────────────────────────────────

  private static isScheduledForDate(schedule: { type: string; days: number[] }, date: Date, timezone: string): boolean {
    const dayStr = date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'short' });
    const daysMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    const day = daysMap[dayStr]; // 0=Sun
    switch (schedule?.type) {
      case 'daily': return true;
      case 'weekdays': return day >= 1 && day <= 5;
      case 'weekends': return day === 0 || day === 6;
      case 'custom': return schedule.days?.includes(day) ?? false;
      default: return true;
    }
  }

  private static isScheduledToday(schedule: { type: string; days: number[] }, timezone: string): boolean {
    return this.isScheduledForDate(schedule, new Date(), timezone);
  }

  private static getUpcomingReminders(habits: any[], timezone: string): UpcomingReminder[] {
    const reminders: UpcomingReminder[] = [];
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: timezone });
    const timeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
    // Adjust formatter output if it yields "24:00" for midnight or missing leading zero
    let nowTimeStr = timeFormatter.format(now);
    if (nowTimeStr.match(/^\d:/)) nowTimeStr = `0${nowTimeStr}`;
    
    for (const h of habits) {
      if (!h.reminder?.enabled || !h.reminder?.time) continue;
      
      const time = h.reminder.time; // "08:00"
      
      // Check today
      if (this.isScheduledForDate(h.repeatSchedule, now, timezone)) {
        if (time > nowTimeStr) {
          reminders.push({
            id: String(h._id),
            habitName: h.title,
            icon: h.icon,
            scheduledAt: `${todayStr}T${time}:00`,
          });
          continue;
        }
      }
      
      // Check tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      if (this.isScheduledForDate(h.repeatSchedule, tomorrow, timezone)) {
        const tomorrowStr = tomorrow.toLocaleDateString('en-CA', { timeZone: timezone });
        reminders.push({
          id: String(h._id),
          habitName: h.title,
          icon: h.icon,
          scheduledAt: `${tomorrowStr}T${time}:00`,
        });
      }
    }
    
    // Sort by scheduled time and return top 5
    return reminders.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)).slice(0, 5);
  }

  private static async getWeeklyLogs(userId: string, timezone: string): Promise<any[]> {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    const from = weekAgo.toLocaleDateString('en-CA', { timeZone: timezone });
    const to = today.toLocaleDateString('en-CA', { timeZone: timezone });
    return HabitLog.find({ userId, date: { $gte: from, $lte: to } }).lean();
  }

  private static buildWeeklySummary(logs: any[], totalHabits: number, streak: number, timezone: string): WeeklySummary {
    const today = new Date();
    const dailyRates: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA', { timeZone: timezone });
      const dayLogs = logs.filter((l) => l.date === dateStr);
      const completed = dayLogs.filter((l) => l.completed).length;
      const rate = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;
      dailyRates.push(rate);
    }

    const habitsCompleted = logs.filter((l) => l.completed).length;
    const total = logs.length;
    const completionRate = total > 0 ? Math.round((habitsCompleted / total) * 100) : 0;

    return { completionRate, habitsCompleted, totalHabits, streak, dailyRates };
  }

  private static computeProductivityScore(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }
}
