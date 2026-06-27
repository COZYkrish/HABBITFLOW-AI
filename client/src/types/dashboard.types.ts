/**
 * Client-side mirror of the dashboard data types.
 * Must stay in sync with server/src/modules/dashboard/dashboard.types.ts.
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
  timestamp: string;
}

export interface WeeklySummary {
  completionRate: number;
  habitsCompleted: number;
  totalHabits: number;
  streak: number;
  dailyRates: number[];
}

export interface UpcomingReminder {
  id: string;
  habitName: string;
  scheduledAt: string;
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
