import { Schema, Document, model, Types } from 'mongoose';

export type HistoryEventType = 'xp_earned' | 'achievement_unlocked' | 'level_up' | 'challenge_completed' | 'milestone_reached';

export interface IProgressHistory extends Document {
  userId: Types.ObjectId;
  eventType: HistoryEventType;
  description: string;
  xpEarned: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressHistorySchema = new Schema<IProgressHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    eventType: { 
      type: String, 
      enum: ['xp_earned', 'achievement_unlocked', 'level_up', 'challenge_completed', 'milestone_reached'],
      required: true 
    },
    description: { type: String, required: true },
    xpEarned: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Index for chronological querying of a user's history
ProgressHistorySchema.index({ userId: 1, createdAt: -1 });

export const ProgressHistoryModel = model<IProgressHistory>('ProgressHistory', ProgressHistorySchema);
