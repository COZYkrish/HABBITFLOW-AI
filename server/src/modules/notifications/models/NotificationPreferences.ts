import { Document, Schema, Types } from 'mongoose';

export interface INotificationPreferences extends Document {
  userId: Types.ObjectId;
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string;
  weeklySummary: boolean;
  weeklySummaryDay: number;
  weeklySummaryTime: string;
  morningSummary: boolean;
  morningSummaryTime: string;
  eveningSummary: boolean;
  eveningSummaryTime: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationPreferencesSchema = new Schema<INotificationPreferences>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    enabled: { type: Boolean, default: true },
    dailyReminder: { type: Boolean, default: true },
    dailyReminderTime: { type: String, default: '19:00' },
    weeklySummary: { type: Boolean, default: true },
    weeklySummaryDay: { type: Number, default: 0 }, // Sunday
    weeklySummaryTime: { type: String, default: '09:00' },
    morningSummary: { type: Boolean, default: false },
    morningSummaryTime: { type: String, default: '08:00' },
    eveningSummary: { type: Boolean, default: false },
    eveningSummaryTime: { type: String, default: '21:00' },
    quietHoursEnabled: { type: Boolean, default: true },
    quietHoursStart: { type: String, default: '22:00' },
    quietHoursEnd: { type: String, default: '07:00' },
    timezone: { type: String, default: 'UTC' },
  },
  { timestamps: true }
);

import mongoose from 'mongoose';
export const NotificationPreferences = mongoose.model<INotificationPreferences>('NotificationPreferences', NotificationPreferencesSchema);
