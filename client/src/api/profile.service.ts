import { apiClient as api } from './axios';

export interface UpdateProfileDTO {
  name?: string;
  bio?: string;
  timezone?: string;
  weekStart?: 'Sunday' | 'Monday';
}

export interface UpdatePreferencesDTO {
  theme?: 'light' | 'dark' | 'system';
  notificationsEnabled?: boolean;
  language?: string;
  dashboardLayout?: string;
  reducedMotion?: boolean;
  compactMode?: boolean;
}

export interface ChangePasswordDTO {
  currentPassword?: string;
  newPassword: string;
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  weekStart: string;
  preferences: {
    theme: string;
    notificationsEnabled: boolean;
    language: string;
    dashboardLayout: string;
    reducedMotion: boolean;
    compactMode: boolean;
  };
  statistics: {
    totalHabits: number;
    longestStreak: number;
    currentStreak: number;
    achievementsCount: number;
  };
  createdAt: string;
  lastLogin?: string;
}

export interface SessionResponse {
  _id: string;
  device?: string;
  browser?: string;
  os?: string;
  ip?: string;
  lastActivity: string;
}

export const profileApi = {
  getProfile: async () => {
    const res = await api.get<{ success: boolean; data: ProfileResponse }>('/profile');
    return res.data.data;
  },

  updateProfile: async (data: UpdateProfileDTO) => {
    const res = await api.patch<{ success: boolean; data: ProfileResponse }>('/profile', data);
    return res.data.data;
  },

  updatePreferences: async (data: UpdatePreferencesDTO) => {
    const res = await api.patch<{ success: boolean; data: ProfileResponse }>('/profile/preferences', data);
    return res.data.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post<{ success: boolean; data: ProfileResponse }>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  deleteAvatar: async () => {
    const res = await api.delete<{ success: boolean; data: ProfileResponse }>('/profile/avatar');
    return res.data.data;
  },

  changePassword: async (data: ChangePasswordDTO) => {
    await api.patch('/profile/security/password', data);
  },

  deleteAccount: async () => {
    await api.delete('/profile');
  },

  getActiveSessions: async () => {
    const res = await api.get<{ success: boolean; data: SessionResponse[] }>('/profile/sessions');
    return res.data.data;
  },

  revokeSession: async (sessionId: string) => {
    await api.delete(`/profile/sessions/${sessionId}`);
  },
};
