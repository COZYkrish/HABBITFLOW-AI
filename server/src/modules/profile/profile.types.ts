export interface UpdateProfileDTO {
  name?: string;
  bio?: string;
  timezone?: string;
  weekStart?: 'Sunday' | 'Monday';
}

export interface UpdatePreferencesDTO {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  dashboardLayout?: string;
  reducedMotion?: boolean;
  compactMode?: boolean;
}

export interface ChangePasswordDTO {
  currentPassword?: string; // Optional because they might be using social login without password?
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
