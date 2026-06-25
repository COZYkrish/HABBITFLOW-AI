import mongoose, { Schema, Document, Types } from 'mongoose';

// ── Enums ──────────────────────────────────────────────────────────────────

export type HabitPriority = 'low' | 'medium' | 'high' | 'critical';
export type HabitStatus = 'active' | 'paused' | 'archived' | 'completed' | 'deleted';
export type GoalType = 'boolean' | 'duration' | 'count';
export type RepeatType = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly' | 'yearly' | 'custom';

// ── Sub-document interfaces ────────────────────────────────────────────────

export interface IRepeatSchedule {
  type: RepeatType;
  /** Days of week (0=Sun, 1=Mon…6=Sat). Used when type is 'custom' or 'weekly'. */
  days: number[];
  /** Day of month (1–31). Used for 'monthly'. */
  dayOfMonth?: number;
}

export interface IReminder {
  enabled: boolean;
  /** HH:mm in 24h format, e.g. "07:30" */
  time?: string;
  /** IANA timezone string, e.g. "Asia/Kolkata" */
  timezone?: string;
}

export interface IHabitStatistics {
  totalLogs: number;
  completedLogs: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: Date;
}

// ── Main Interface ─────────────────────────────────────────────────────────

export interface IHabit extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  /** Category ID — references Category collection */
  category: string;
  /** Lucide icon name, e.g. "Dumbbell" */
  icon: string;
  /** Color token name, e.g. "zinc" | "slate" | "rose" */
  color: string;
  priority: HabitPriority;
  goalType: GoalType;
  /** Target value: minutes for 'duration', count for 'count', ignored for 'boolean' */
  targetValue: number;
  /** Estimated duration in minutes */
  estimatedDuration: number;
  repeatSchedule: IRepeatSchedule;
  reminder: IReminder;
  notes?: string;
  status: HabitStatus;
  isArchived: boolean;
  isPaused: boolean;
  /** For drag-and-drop ordering (Phase 5+) */
  sortOrder: number;
  statistics: IHabitStatistics;
  /** Soft delete timestamp */
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ─────────────────────────────────────────────────────────────────

const RepeatScheduleSchema = new Schema<IRepeatSchedule>(
  {
    type: {
      type: String,
      enum: ['daily', 'weekdays', 'weekends', 'weekly', 'monthly', 'yearly', 'custom'],
      default: 'daily',
    },
    days: { type: [Number], default: [] },
    dayOfMonth: { type: Number },
  },
  { _id: false }
);

const ReminderSchema = new Schema<IReminder>(
  {
    enabled: { type: Boolean, default: false },
    time: { type: String },
    timezone: { type: String },
  },
  { _id: false }
);

const HabitStatisticsSchema = new Schema<IHabitStatistics>(
  {
    totalLogs: { type: Number, default: 0 },
    completedLogs: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedAt: { type: Date },
  },
  { _id: false }
);

const HabitSchema = new Schema<IHabit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    category: { type: String, required: true, default: 'general' },
    icon: { type: String, default: 'Circle' },
    color: { type: String, default: 'zinc' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    goalType: {
      type: String,
      enum: ['boolean', 'duration', 'count'],
      default: 'boolean',
    },
    targetValue: { type: Number, default: 1, min: 1 },
    estimatedDuration: { type: Number, default: 15, min: 1 },
    repeatSchedule: { type: RepeatScheduleSchema, default: () => ({ type: 'daily', days: [] }) },
    reminder: { type: ReminderSchema, default: () => ({ enabled: false }) },
    notes: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['active', 'paused', 'archived', 'completed', 'deleted'],
      default: 'active',
      index: true,
    },
    isArchived: { type: Boolean, default: false },
    isPaused: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    statistics: { type: HabitStatisticsSchema, default: () => ({}) },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// ── Compound indexes for performance ─────────────────────────────────────
HabitSchema.index({ userId: 1, status: 1 });
HabitSchema.index({ userId: 1, deletedAt: 1 });
HabitSchema.index({ userId: 1, isArchived: 1 });
HabitSchema.index({ userId: 1, sortOrder: 1 });

export const Habit = mongoose.model<IHabit>('Habit', HabitSchema);
