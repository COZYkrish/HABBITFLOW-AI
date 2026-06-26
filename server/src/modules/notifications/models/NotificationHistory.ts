import { Document, Schema, Types } from 'mongoose';
import { NotificationType } from '../notifications.types';

export interface INotificationHistory extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, any>;
  status: 'sent' | 'opened' | 'dismissed' | 'snoozed' | 'action_taken';
  sentAt: Date;
  updatedAt: Date;
}

const NotificationHistorySchema = new Schema<INotificationHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    icon: { type: String },
    data: { type: Schema.Types.Mixed },
    status: { 
      type: String, 
      enum: ['sent', 'opened', 'dismissed', 'snoozed', 'action_taken'],
      default: 'sent'
    },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'sentAt', updatedAt: 'updatedAt' } }
);

import mongoose from 'mongoose';
export const NotificationHistory = mongoose.model<INotificationHistory>('NotificationHistory', NotificationHistorySchema);
