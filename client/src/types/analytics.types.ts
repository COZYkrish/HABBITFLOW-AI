export type TrendDirection = 'up' | 'down' | 'stable';

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsFilters extends DateRange {
  timezone?: string;
  categoryId?: string;
  habitId?: string;
  year?: string;
  month?: string;
}

export interface DayActivity {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface CategoryStats {
  category: string;
  completionPercentage: number;
  habitCount: number;
  timeInvested: number;
}

export interface ChartDataPoint {
  label: string;
  date?: string;
  completed: number;
  missed: number;
  value: number;
}

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
  averageDuration: number;
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
  monthlyCompletions: number[];
  bestMonth: string;
  worstMonth: string;
  yearlyStreak: number;
  yearlyConsistency: number;
  chartData: ChartDataPoint[];
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
