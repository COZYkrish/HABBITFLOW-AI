/** Client-side Habit domain types — mirrors server/src/modules/habit/habit.types.ts */

export type HabitPriority = 'low' | 'medium' | 'high' | 'critical';
export type HabitStatus = 'active' | 'paused' | 'archived' | 'completed' | 'deleted';
export type GoalType = 'boolean' | 'duration' | 'count';
export type RepeatType = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RepeatSchedule {
  type: RepeatType;
  days: number[];
  dayOfMonth?: number;
}

export interface Reminder {
  enabled: boolean;
  time?: string;
  timezone?: string;
}

export interface HabitStatistics {
  totalLogs: number;
  completedLogs: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: string;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  priority: HabitPriority;
  goalType: GoalType;
  targetValue: number;
  estimatedDuration: number;
  repeatSchedule: RepeatSchedule;
  reminder: Reminder;
  notes?: string;
  status: HabitStatus;
  isArchived: boolean;
  isPaused: boolean;
  sortOrder: number;
  statistics: HabitStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
  completionTime?: string;
  value?: number;
  notes?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

export interface CreateHabitData {
  title: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  priority: HabitPriority;
  goalType: GoalType;
  targetValue: number;
  estimatedDuration: number;
  repeatSchedule: RepeatSchedule;
  reminder: Reminder;
  notes?: string;
}

export type UpdateHabitData = Partial<CreateHabitData>;

export interface ListHabitsParams {
  search?: string;
  status?: HabitStatus;
  priority?: HabitPriority;
  category?: string;
  isArchived?: boolean;
  isPaused?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'sortOrder';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedHabits {
  habits: Habit[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LogHabitData {
  date: string;
  completed: boolean;
  value?: number;
  notes?: string;
}
