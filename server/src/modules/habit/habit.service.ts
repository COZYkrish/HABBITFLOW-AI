import { HabitRepository } from './habit.repository';
import { HabitMapper } from './habit.mapper';
import { User } from '../auth/models/User';
import type {
  CreateHabitDTO,
  UpdateHabitDTO,
  LogHabitDTO,
  ListHabitsQuery,
} from './habit.types';
import { CategoryResponse, HabitLogResponse, HabitResponse, PaginatedHabitsResponse } from './habit.types';
import { gamificationService } from '../gamification/gamification.service';
import { XP_REWARDS } from '../gamification/constants/xp.constants';

/**
 * HabitService — business logic for all habit operations.
 * Enforces ownership, validates status transitions, updates User statistics.
 */
export class HabitService {
  // ── CRUD ──────────────────────────────────────────────────────────────────

  static async createHabit(userId: string, data: CreateHabitDTO): Promise<HabitResponse> {
    const habit = await HabitRepository.create(userId, data);
    await HabitService.incrementUserHabitCount(userId, 1);
    await HabitService.triggerReminderSync(userId);
    return HabitMapper.toResponse(habit);
  }

  static async getHabits(userId: string, query: ListHabitsQuery): Promise<PaginatedHabitsResponse> {
    const result = await HabitRepository.findAll(userId, query);
    return {
      ...result,
      habits: result.habits.map(HabitMapper.toResponse),
    };
  }

  static async getHabitById(userId: string, habitId: string): Promise<HabitResponse> {
    const habit = await HabitRepository.findById(habitId, userId);
    if (!habit) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });
    return HabitMapper.toResponse(habit);
  }

  static async updateHabit(userId: string, habitId: string, data: UpdateHabitDTO): Promise<HabitResponse> {
    const habit = await HabitRepository.update(habitId, userId, data);
    if (!habit) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });
    await HabitService.triggerReminderSync(userId);
    return HabitMapper.toResponse(habit);
  }

  static async deleteHabit(userId: string, habitId: string): Promise<void> {
    const habit = await HabitRepository.softDelete(habitId, userId);
    if (!habit) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });
    await HabitService.incrementUserHabitCount(userId, -1);
    await HabitService.triggerReminderSync(userId);
  }

  // ── Status transitions ────────────────────────────────────────────────────

  static async archiveHabit(userId: string, habitId: string): Promise<HabitResponse> {
    const current = await HabitRepository.findById(habitId, userId);
    if (!current) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });

    const isArchived = !current.isArchived;
    const habit = await HabitRepository.setStatus(habitId, userId, {
      isArchived,
      status: isArchived ? 'archived' : 'active',
    });
    await HabitService.triggerReminderSync(userId);
    return HabitMapper.toResponse(habit!);
  }

  static async pauseHabit(userId: string, habitId: string): Promise<HabitResponse> {
    const current = await HabitRepository.findById(habitId, userId);
    if (!current) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });
    if (current.isPaused) throw Object.assign(new Error('Habit is already paused'), { statusCode: 400 });

    const habit = await HabitRepository.setStatus(habitId, userId, {
      isPaused: true,
      status: 'paused',
    });
    await HabitService.triggerReminderSync(userId);
    return HabitMapper.toResponse(habit!);
  }

  static async resumeHabit(userId: string, habitId: string): Promise<HabitResponse> {
    const current = await HabitRepository.findById(habitId, userId);
    if (!current) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });
    if (!current.isPaused) throw Object.assign(new Error('Habit is not paused'), { statusCode: 400 });

    const habit = await HabitRepository.setStatus(habitId, userId, {
      isPaused: false,
      status: 'active',
    });
    await HabitService.triggerReminderSync(userId);
    return HabitMapper.toResponse(habit!);
  }

  static async duplicateHabit(userId: string, habitId: string): Promise<HabitResponse> {
    const habit = await HabitRepository.duplicate(habitId, userId);
    if (!habit) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });
    await HabitService.incrementUserHabitCount(userId, 1);
    return HabitMapper.toResponse(habit);
  }

  // ── Habit Logging ──────────────────────────────────────────────────────────

  static async logHabit(userId: string, habitId: string, data: LogHabitDTO): Promise<HabitLogResponse> {
    // Verify ownership
    const habit = await HabitRepository.findById(habitId, userId);
    if (!habit) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });

    const log = await HabitRepository.upsertLog(habitId, userId, data);

    // Always recalculate habit streak to handle unchecking
    await HabitService.recalculateStreak(habitId, userId);
    await HabitService.recalculateUserStreak(userId);

    // Gamification events only on completion
    if (data.completed) {
      try {
        const updatedHabit = await HabitRepository.findById(habitId, userId);
        const streak = updatedHabit?.statistics?.currentStreak || 1;
        
        await gamificationService.dispatchXPEvent({
          userId,
          action: 'HABIT_COMPLETED',
          xpAmount: XP_REWARDS.HABIT_COMPLETED,
          metadata: { habitId, streak }
        });
        
        // Let's also check for streak rewards
        if (streak === 7) {
          await gamificationService.dispatchXPEvent({ userId, action: 'STREAK_7_DAY', xpAmount: XP_REWARDS.STREAK_7_DAY, metadata: { habitId, streak } });
        } else if (streak === 30) {
          await gamificationService.dispatchXPEvent({ userId, action: 'STREAK_30_DAY', xpAmount: XP_REWARDS.STREAK_30_DAY, metadata: { habitId, streak } });
        }
      } catch (err) {
        console.error('Gamification XP Event Failed:', err);
      }
    }

    return HabitMapper.toLogResponse(log);
  }

  static async getHabitLogs(
    userId: string,
    habitId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<HabitLogResponse[]> {
    const habit = await HabitRepository.findById(habitId, userId);
    if (!habit) throw Object.assign(new Error('Habit not found'), { statusCode: 404 });

    const logs = await HabitRepository.getLogs(habitId, userId, fromDate, toDate);
    return logs.map(HabitMapper.toLogResponse);
  }

  // ── Categories ────────────────────────────────────────────────────────────

  static async getCategories(userId: string): Promise<CategoryResponse[]> {
    const cats = await HabitRepository.getCategories(userId);
    return cats.map(HabitMapper.toCategoryResponse);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private static async incrementUserHabitCount(userId: string, delta: number) {
    await User.findByIdAndUpdate(userId, {
      $inc: { 'statistics.totalHabits': delta },
    });
  }

  /**
   * Recalculates the current streak for a habit after a log event.
   * Looks at the last N logs sorted by date descending.
   */
  private static async recalculateStreak(habitId: string, userId: string): Promise<void> {
    const logs = await HabitRepository.getLogs(habitId, userId);
    const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    let prev: Date | null = null;

    for (const log of sorted) {
      if (!log.completed) break;
      const date = new Date(log.date);
      if (prev === null) {
        streak = 1;
        prev = date;
        continue;
      }
      const diffDays = Math.round((prev.getTime() - date.getTime()) / 86_400_000);
      if (diffDays === 1) {
        streak++;
        prev = date;
      } else {
        break;
      }
    }

    const { Habit } = await import('./models/Habit');
    const habit = await Habit.findById(habitId);
    if (!habit) return;

    const longestStreak = Math.max(streak, habit.statistics.longestStreak ?? 0);
    habit.statistics.currentStreak = streak;
    habit.statistics.longestStreak = longestStreak;
    habit.statistics.completedLogs = sorted.filter((l) => l.completed).length;
    habit.statistics.totalLogs = sorted.length;
    habit.statistics.lastCompletedAt = sorted[0]?.completed ? new Date(sorted[0].date) : undefined;
    await habit.save();
  }

  private static async recalculateUserStreak(userId: string): Promise<void> {
    const user = await User.findById(userId).select('timezone').lean();
    const timezone = user?.timezone || 'UTC';

    const { HabitLog } = await import('./models/HabitLog');
    const logs = await HabitLog.find({ userId, completed: true }).select('date').lean();
    const completedDates = logs.map((l: any) => l.date);

    const { StreakEngine } = await import('../analytics/engine/streak.engine');
    
    const todayDate = new Date();
    const todayStr = todayDate.toLocaleDateString('en-CA', { timeZone: timezone });
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toLocaleDateString('en-CA', { timeZone: timezone });

    const streakInfo = StreakEngine.calculateStreaks(completedDates, todayStr, yesterdayStr);

    const lastCompletedAt = completedDates.length > 0 
      ? new Date([...completedDates].sort().pop()!) 
      : undefined;

    await User.findByIdAndUpdate(userId, {
      $set: { 
        'statistics.currentStreak': streakInfo.currentStreak,
        'statistics.lastCompletedAt': lastCompletedAt,
      },
      $max: { 'statistics.longestStreak': streakInfo.bestStreak },
    });
  }

  private static async triggerReminderSync(userId: string): Promise<void> {
    try {
      const { ReminderEngine } = await import('../notifications/engine/reminder.engine');
      await ReminderEngine.syncHabitReminders(userId);
    } catch (err) {
      console.error('Failed to sync habit reminders:', err);
    }
  }
}
