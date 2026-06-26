import { CategoryStats, DayActivity, TrendDirection, ChartDataPoint } from '../analytics.types';

export interface AnalyticsOverviewDTO {
  completionRate: number;
  activeHabits: number;
  totalLogsToday: number;
  currentStreak: number;
  bestStreak: number;
}

export interface HeatmapDTO {
  year: number;
  totalCompletions: number;
  days: DayActivity[];
}

export interface WeeklyAnalyticsDTO {
  startDate: string;
  endDate: string;
  completionPercentage: number;
  habitsCompleted: number;
  missedHabits: number;
  averageDuration: number; // in minutes
  bestDay: string;
  worstDay: string;
  trend: TrendDirection;
  chartData: ChartDataPoint[];
}

export interface MonthlyAnalyticsDTO {
  month: number;
  year: number;
  completionTrend: TrendDirection;
  averageCompletion: number;
  longestStreak: number;
  averageDuration: number;
  chartData: ChartDataPoint[];
}

export interface YearlyAnalyticsDTO {
  year: number;
  monthlyCompletions: number[]; // 12 elements
  bestMonth: string;
  worstMonth: string;
  yearlyStreak: number;
  yearlyConsistency: number; // percentage
  chartData: ChartDataPoint[]; // by month
}

export interface CategoryAnalyticsDTO {
  categories: CategoryStats[];
}

export interface ProductivityDTO {
  consistencyScore: number;
  completionScore: number;
  timeEfficiency: number;
  overallProductivity: number;
}

export interface StreakDTO {
  currentStreak: number;
  bestStreak: number;
  history: {
    startDate: string;
    endDate: string;
    length: number;
  }[];
}
