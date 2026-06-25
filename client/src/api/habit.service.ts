import { apiClient } from './axios';
import type {
  Habit,
  HabitLog,
  Category,
  CreateHabitData,
  UpdateHabitData,
  LogHabitData,
  ListHabitsParams,
  PaginatedHabits,
} from '../types/habit.types';

/** All habit-related API calls. Uses the existing authenticated axios instance. */
export const HabitApiService = {
  /** Create a new habit */
  create: async (data: CreateHabitData): Promise<Habit> => {
    const res = await apiClient.post('/habits', data);
    return res.data.data;
  },

  /** List habits with optional filters, search, sort, and pagination */
  list: async (params?: ListHabitsParams): Promise<PaginatedHabits> => {
    const res = await apiClient.get('/habits', { params });
    return res.data.data;
  },

  /** Get a single habit by ID */
  getById: async (id: string): Promise<Habit> => {
    const res = await apiClient.get(`/habits/${id}`);
    return res.data.data;
  },

  /** Update habit fields */
  update: async (id: string, data: UpdateHabitData): Promise<Habit> => {
    const res = await apiClient.patch(`/habits/${id}`, data);
    return res.data.data;
  },

  /** Soft delete */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/habits/${id}`);
  },

  /** Toggle archive status */
  archive: async (id: string): Promise<Habit> => {
    const res = await apiClient.patch(`/habits/${id}/archive`);
    return res.data.data;
  },

  /** Pause a habit */
  pause: async (id: string): Promise<Habit> => {
    const res = await apiClient.patch(`/habits/${id}/pause`);
    return res.data.data;
  },

  /** Resume a paused habit */
  resume: async (id: string): Promise<Habit> => {
    const res = await apiClient.patch(`/habits/${id}/resume`);
    return res.data.data;
  },

  /** Duplicate a habit */
  duplicate: async (id: string): Promise<Habit> => {
    const res = await apiClient.post(`/habits/${id}/duplicate`);
    return res.data.data;
  },

  /** Log a habit completion for a specific date */
  log: async (id: string, data: LogHabitData): Promise<HabitLog> => {
    const res = await apiClient.post(`/habits/${id}/log`, data);
    return res.data.data;
  },

  /** Get habit logs, optionally filtered by date range */
  getLogs: async (id: string, fromDate?: string, toDate?: string): Promise<HabitLog[]> => {
    const res = await apiClient.get(`/habits/${id}/logs`, { params: { fromDate, toDate } });
    return res.data.data;
  },

  /** Get all available categories (system + user custom) */
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get('/categories');
    return res.data.data;
  },
};
