import { Document, Schema, Types } from 'mongoose';
import { NotificationType } from '../notifications.types';

export interface IReminderQueue extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, any>;
  scheduledAt: Date;
  status: 'pending' | 'processing' | 'failed';
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderQueueSchema = new Schema<IReminderQueue>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    icon: { type: String },
    data: { type: Schema.Types.Mixed },
    scheduledAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ['pending', 'processing', 'failed'], default: 'pending' },
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

import mongoose from 'mongoose';
export const ReminderQueue = mongoose.model<IReminderQueue>('ReminderQueue', ReminderQueueSchema);
