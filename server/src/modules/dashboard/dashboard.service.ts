import { User } from '../auth/models/User';
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
 * Real habit/activity data will be injected in Phase 5 (Habit CRUD).
 * Architecture is structured to accept those dependencies without refactoring.
 */
export class DashboardService {
  /**
   * Returns the complete dashboard summary for a given userId.
   */
  static async getSummary(userId: string): Promise<DashboardSummary> {
    const user = await User.findById(userId).lean();
    if (!user) throw new Error('User not found');

    // ── Real data from User model ────────────────────────────────────────
    const currentStreak = user.statistics?.currentStreak ?? 0;
    const bestStreak = user.statistics?.longestStreak ?? 0;

    // Productivity score: derived from streak. Phase 5+ will use real habit data.
    const productivityScore = DashboardService.computeProductivityScore(currentStreak, bestStreak);

    // ── Mocked data (Phase 5 will replace with real Habit queries) ────────
    const todayHabits: TodayHabit[] = DashboardService.getMockedTodayHabits();
    const recentActivity: ActivityItem[] = DashboardService.getMockedActivity();
    const weeklySummary: WeeklySummary = DashboardService.getMockedWeeklySummary(currentStreak);
    const upcomingReminders: UpcomingReminder[] = DashboardService.getMockedReminders();

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
      upcomingReminders,
    };
  }

  // ── Private helpers ─────────────────────────────────────────────────────

  /**
   * Computes a 0–100 productivity score.
   * Scales with streak relative to best streak. Phase 5+ refines this.
   */
  private static computeProductivityScore(current: number, best: number): number {
    if (best === 0) return 0;
    const ratio = Math.min(current / best, 1);
    return Math.round(ratio * 100);
  }

  /** Mocked today's habits — Phase 5 replaces with Habit model query */
  private static getMockedTodayHabits(): TodayHabit[] {
    return [];
  }

  /** Mocked recent activity — Phase 5 replaces with Activity log query */
  private static getMockedActivity(): ActivityItem[] {
    return [];
  }

  /** Mocked weekly summary — Phase 5 replaces with aggregation query */
  private static getMockedWeeklySummary(streak: number): WeeklySummary {
    return {
      completionRate: 0,
      habitsCompleted: 0,
      totalHabits: 0,
      streak,
      dailyRates: [0, 0, 0, 0, 0, 0, 0],
    };
  }

  /** Mocked reminders — Phase 10 replaces with Reminder model query */
  private static getMockedReminders(): UpcomingReminder[] {
    return [];
  }
}
