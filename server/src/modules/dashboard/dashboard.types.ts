/**
 * Dashboard Module — Shared TypeScript Types
 * These types define the contract for the dashboard summary API response.
 * Future phases (Habit CRUD, Analytics) will populate the mocked fields.
 */

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface TodayHabit {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  estimatedMinutes: number;
  status: 'pending' | 'completed' | 'skipped';
  priority: 'low' | 'medium' | 'high';
}

export interface ActivityItem {
  id: string;
  description: string;
  type: 'completed' | 'skipped' | 'streak' | 'achievement';
  timestamp: string; // ISO string
}

export interface WeeklySummary {
  completionRate: number;
  habitsCompleted: number;
  totalHabits: number;
  streak: number;
  /** Day-by-day completion for mini chart: 0–100 per day */
  dailyRates: number[];
}

export interface UpcomingReminder {
  id: string;
  habitName: string;
  scheduledAt: string; // ISO string
  icon: string;
}

export interface DashboardSummary {
  user: DashboardUser;
  todayHabits: TodayHabit[];
  currentStreak: number;
  bestStreak: number;
  productivityScore: number;
  recentActivity: ActivityItem[];
  weeklySummary: WeeklySummary;
  upcomingReminders: UpcomingReminder[];
}
