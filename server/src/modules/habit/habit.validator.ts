import { z } from 'zod';

const repeatScheduleSchema = z.object({
  type: z.enum(['daily', 'weekdays', 'weekends', 'weekly', 'monthly', 'yearly', 'custom']).default('daily'),
  days: z.array(z.number().min(0).max(6)).default([]),
  dayOfMonth: z.number().min(1).max(31).optional(),
});

const reminderSchema = z.object({
  enabled: z.boolean().default(false),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format').optional(),
  timezone: z.string().optional(),
});

export const createHabitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500).optional(),
  category: z.string().min(1).default('General'),
  icon: z.string().min(1).default('Circle'),
  color: z.string().min(1).default('zinc'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  goalType: z.enum(['boolean', 'duration', 'count']).default('boolean'),
  targetValue: z.number().min(1).default(1),
  estimatedDuration: z.number().min(1).max(1440).default(15),
  repeatSchedule: repeatScheduleSchema.default({ type: 'daily', days: [] }),
  reminder: reminderSchema.default({ enabled: false }),
  notes: z.string().max(2000).optional(),
});

export const updateHabitSchema = createHabitSchema.partial();

export const logHabitSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  completed: z.boolean(),
  value: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const listHabitsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'paused', 'archived', 'completed', 'deleted']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.string().optional(),
  isArchived: z.coerce.boolean().optional(),
  isPaused: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority', 'sortOrder']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type LogHabitInput = z.infer<typeof logHabitSchema>;
export type ListHabitsQueryInput = z.infer<typeof listHabitsQuerySchema>;
