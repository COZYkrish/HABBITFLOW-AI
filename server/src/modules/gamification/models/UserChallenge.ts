import { Schema, Document, model, Types } from 'mongoose';
import { ChallengeDifficulty, ChallengeStatus } from '../types/gamification.types';

export interface IUserChallenge extends Document {
  userId: Types.ObjectId;
  challengeId: string; // e.g., 'weekly-workout', 'read-100-pages'
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  rewardTier: string;
  xpReward: number;
  currentProgress: number;
  targetProgress: number;
  expiresAt: Date;
  status: ChallengeStatus;
  estimatedCompletionTime?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserChallengeSchema = new Schema<IUserChallenge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'extreme'], required: true },
    rewardTier: { type: String, required: true },
    xpReward: { type: Number, required: true },
    currentProgress: { type: Number, default: 0 },
    targetProgress: { type: Number, required: true },
    expiresAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ['active', 'completed', 'expired', 'failed'], default: 'active' },
    estimatedCompletionTime: { type: Number },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const UserChallengeModel = model<IUserChallenge>('UserChallenge', UserChallengeSchema);
