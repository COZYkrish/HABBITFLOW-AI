import { Schema, Document, model, Types } from 'mongoose';

export interface IUserXP extends Document {
  userId: Types.ObjectId;
  currentXP: number;
  lifetimeXP: number;
  currentLevel: number;
  xpRequiredForNextLevel: number;
  xpEarnedToday: number;
  xpEarnedThisWeek: number;
  xpEarnedThisMonth: number;
  lastXPEvent?: Date;
  lastLevelUp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserXPSchema = new Schema<IUserXP>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentXP: { type: Number, default: 0 },
    lifetimeXP: { type: Number, default: 0 },
    currentLevel: { type: Number, default: 1 },
    xpRequiredForNextLevel: { type: Number, default: 250 }, // Base XP for level 2
    xpEarnedToday: { type: Number, default: 0 },
    xpEarnedThisWeek: { type: Number, default: 0 },
    xpEarnedThisMonth: { type: Number, default: 0 },
    lastXPEvent: { type: Date },
    lastLevelUp: { type: Date },
  },
  { timestamps: true }
);

export const UserXPModel = model<IUserXP>('UserXP', UserXPSchema);
