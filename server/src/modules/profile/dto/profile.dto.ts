export interface UpdateProfileDto {
  name?: string;
  bio?: string;
  timezone?: string;
  weekStart?: 'Sunday' | 'Monday';
}

export interface UpdatePreferencesDto {
  theme?: 'light' | 'dark' | 'system';
  notificationsEnabled?: boolean;
  language?: string;
  dashboardLayout?: string;
  reducedMotion?: boolean;
  compactMode?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
