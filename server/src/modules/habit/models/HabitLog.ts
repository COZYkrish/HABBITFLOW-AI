import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * HabitLog — records a single day's completion event for a habit.
 * Powers: Analytics, Calendar Heatmap, Reports, AI Insights, Achievements.
 * Compound unique index ensures one log per habit per day.
 */
export interface IHabitLog extends Document {
  habitId: Types.ObjectId;
  userId: Types.ObjectId;
  /** ISO date string YYYY-MM-DD — stored as string for timezone-safe querying */
  date: string;
  completed: boolean;
  /** ISO timestamp of when the habit was marked complete */
  completionTime?: Date;
  /** Logged value: minutes for 'duration', count for 'count' goals */
  value?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HabitLogSchema = new Schema<IHabitLog>(
  {
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    completed: { type: Boolean, required: true, default: false },
    completionTime: { type: Date },
    value: { type: Number },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// One log per habit per day
HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });
// Query all logs for a user in a date range (Calendar, Analytics)
HabitLogSchema.index({ userId: 1, date: 1 });
// Query logs for a specific habit ordered by date (streak calc)
HabitLogSchema.index({ habitId: 1, date: -1 });

export const HabitLog = mongoose.model<IHabitLog>('HabitLog', HabitLogSchema);
