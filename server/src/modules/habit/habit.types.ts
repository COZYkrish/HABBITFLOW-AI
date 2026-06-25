import type { IHabit } from './models/Habit';
import type { IHabitLog } from './models/HabitLog';
import type { ICategory } from './models/Category';

// ── Re-export model types ──────────────────────────────────────────────────
export type { IHabit, IHabitLog, ICategory };

// ── Query params ───────────────────────────────────────────────────────────

export interface ListHabitsQuery {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  isArchived?: boolean;
  isPaused?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'sortOrder';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ── DTOs (Data Transfer Objects) ───────────────────────────────────────────

export interface CreateHabitDTO {
  title: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  goalType: 'boolean' | 'duration' | 'count';
  targetValue: number;
  estimatedDuration: number;
  repeatSchedule: {
    type: string;
    days: number[];
    dayOfMonth?: number;
  };
  reminder: {
    enabled: boolean;
    time?: string;
    timezone?: string;
  };
  notes?: string;
}

export type UpdateHabitDTO = Partial<CreateHabitDTO>;

export interface LogHabitDTO {
  date: string;
  completed: boolean;
  value?: number;
  notes?: string;
}

// ── API Response shapes ────────────────────────────────────────────────────

export interface HabitResponse {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  priority: string;
  goalType: string;
  targetValue: number;
  estimatedDuration: number;
  repeatSchedule: {
    type: string;
    days: number[];
    dayOfMonth?: number;
  };
  reminder: {
    enabled: boolean;
    time?: string;
    timezone?: string;
  };
  notes?: string;
  status: string;
  isArchived: boolean;
  isPaused: boolean;
  sortOrder: number;
  statistics: {
    totalLogs: number;
    completedLogs: number;
    currentStreak: number;
    longestStreak: number;
    lastCompletedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HabitLogResponse {
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

export interface CategoryResponse {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

export interface PaginatedHabitsResponse {
  habits: HabitResponse[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
