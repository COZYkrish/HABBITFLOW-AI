import { Schema, Document, model, Types } from 'mongoose';
import { ChallengeStatus } from '../types/gamification.types';

export interface IDailyGoal extends Document {
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD format
  title: string;
  description: string;
  currentProgress: number;
  targetProgress: number;
  reward: string;
  xpReward: number;
  status: ChallengeStatus;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DailyGoalSchema = new Schema<IDailyGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    currentProgress: { type: Number, default: 0 },
    targetProgress: { type: Number, required: true },
    reward: { type: String, required: true },
    xpReward: { type: Number, required: true },
    status: { type: String, enum: ['active', 'completed', 'expired', 'failed'], default: 'active' },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// One daily goal per user per day
DailyGoalSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyGoalModel = model<IDailyGoal>('DailyGoal', DailyGoalSchema);
