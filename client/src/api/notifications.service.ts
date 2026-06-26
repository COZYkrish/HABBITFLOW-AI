import { apiClient as api } from './axios';

export interface NotificationPreferencesDTO {
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
}

export interface UpcomingNotificationDTO {
  _id: string;
  type: string;
  title: string;
  body: string;
  scheduledAt: string;
  icon?: string;
  data?: Record<string, any>;
}

export interface NotificationHistoryDTO {
  _id: string;
  type: string;
  title: string;
  body: string;
  sentAt: string;
  status: 'sent' | 'opened' | 'dismissed' | 'snoozed' | 'action_taken';
  icon?: string;
}

export const notificationsApi = {
  getPreferences: async () => {
    const res = await api.get<{ success: boolean; data: NotificationPreferencesDTO }>('/notifications/preferences');
    return res.data.data;
  },

  updatePreferences: async (data: Partial<NotificationPreferencesDTO>) => {
    const res = await api.patch<{ success: boolean; data: NotificationPreferencesDTO }>('/notifications/preferences', data);
    return res.data.data;
  },

  getHistory: async () => {
    const res = await api.get<{ success: boolean; data: NotificationHistoryDTO[] }>('/notifications/history');
    return res.data.data;
  },

  getUpcoming: async () => {
    const res = await api.get<{ success: boolean; data: UpcomingNotificationDTO[] }>('/notifications/upcoming');
    return res.data.data;
  },

  testNotification: async () => {
    await api.post('/notifications/test');
  },

  snooze: async (historyId: string, queueId: string | undefined, minutes: number) => {
    await api.post('/notifications/snooze', { historyId, queueId, minutes });
  },

  markRead: async (historyId: string) => {
    await api.post('/notifications/mark-read', { historyId });
  },

  markDispatched: async (payload: { queueId: string; type: string; title: string; body: string; icon?: string; data?: any }) => {
    await api.post('/notifications/mark-dispatched', payload);
  }
};
