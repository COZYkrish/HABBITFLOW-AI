import type { IHabit } from './models/Habit';
import type { IHabitLog } from './models/HabitLog';
import type { ICategory } from './models/Category';
import type { HabitResponse, HabitLogResponse, CategoryResponse } from './habit.types';

/**
 * HabitMapper — converts Mongoose documents to API response DTOs.
 * Decouples persistence schema from API contract, enabling both to evolve independently.
 */
export class HabitMapper {
  static toResponse(habit: IHabit | Record<string, any>): HabitResponse {
    return {
      id: String(habit._id),
      userId: String(habit.userId),
      title: habit.title,
      description: habit.description,
      category: habit.category,
      icon: habit.icon,
      color: habit.color,
      priority: habit.priority,
      goalType: habit.goalType,
      targetValue: habit.targetValue,
      estimatedDuration: habit.estimatedDuration,
      repeatSchedule: {
        type: habit.repeatSchedule?.type ?? 'daily',
        days: habit.repeatSchedule?.days ?? [],
        dayOfMonth: habit.repeatSchedule?.dayOfMonth,
      },
      reminder: {
        enabled: habit.reminder?.enabled ?? false,
        time: habit.reminder?.time,
        timezone: habit.reminder?.timezone,
      },
      notes: habit.notes,
      status: habit.status,
      isArchived: habit.isArchived,
      isPaused: habit.isPaused,
      sortOrder: habit.sortOrder,
      statistics: {
        totalLogs: habit.statistics?.totalLogs ?? 0,
        completedLogs: habit.statistics?.completedLogs ?? 0,
        currentStreak: habit.statistics?.currentStreak ?? 0,
        longestStreak: habit.statistics?.longestStreak ?? 0,
        lastCompletedAt: habit.statistics?.lastCompletedAt?.toISOString?.(),
      },
      createdAt: habit.createdAt instanceof Date
        ? habit.createdAt.toISOString()
        : String(habit.createdAt),
      updatedAt: habit.updatedAt instanceof Date
        ? habit.updatedAt.toISOString()
        : String(habit.updatedAt),
    };
  }

  static toLogResponse(log: IHabitLog | Record<string, any>): HabitLogResponse {
    return {
      id: String(log._id),
      habitId: String(log.habitId),
      userId: String(log.userId),
      date: log.date,
      completed: log.completed,
      completionTime: log.completionTime?.toISOString?.(),
      value: log.value,
      notes: log.notes,
      createdAt: log.createdAt instanceof Date
        ? log.createdAt.toISOString()
        : String(log.createdAt),
    };
  }

  static toCategoryResponse(cat: ICategory | Record<string, any>): CategoryResponse {
    return {
      id: String(cat._id),
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      isSystem: cat.isSystem,
    };
  }
}
