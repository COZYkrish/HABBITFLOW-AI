import { Schema, Document, model, Types } from 'mongoose';

export interface IUserAchievement extends Document {
  userId: Types.ObjectId;
  achievementId: string;
  currentProgress: number;
  targetProgress: number;
  percentageComplete: number;
  unlocked: boolean;
  unlockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserAchievementSchema = new Schema<IUserAchievement>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    achievementId: { type: String, required: true },
    currentProgress: { type: Number, default: 0 },
    targetProgress: { type: Number, required: true },
    percentageComplete: { type: Number, default: 0 },
    unlocked: { type: Boolean, default: false, index: true },
    unlockedAt: { type: Date },
  },
  { timestamps: true }
);

// A user can only have one progress tracker per achievement
UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const UserAchievementModel = model<IUserAchievement>('UserAchievement', UserAchievementSchema);
