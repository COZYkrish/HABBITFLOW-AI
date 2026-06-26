/**
 * Notifications Module — Shared TypeScript Types & DTOs
 */

export interface NotificationPreferencesDTO {
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string; // HH:mm
  weeklySummary: boolean;
  weeklySummaryDay: number; // 0-6 (Sunday-Saturday)
  weeklySummaryTime: string; // HH:mm
  morningSummary: boolean;
  morningSummaryTime: string; // HH:mm
  eveningSummary: boolean;
  eveningSummaryTime: string; // HH:mm
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
  timezone: string;
}

export type NotificationType = 
  | 'habit_reminder' 
  | 'daily_summary' 
  | 'weekly_summary' 
  | 'missed_habit' 
  | 'streak_warning' 
  | 'achievement';

export interface UpcomingNotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  scheduledAt: string;
  icon?: string;
  data?: Record<string, any>;
}

export interface NotificationHistoryDTO {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  sentAt: string;
  status: 'sent' | 'opened' | 'dismissed' | 'snoozed' | 'action_taken';
  icon?: string;
}
