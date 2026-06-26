export type Timezone = string;

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export type TrendDirection = 'up' | 'down' | 'stable';

export interface AnalyticsFilters {
  timezone?: Timezone;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  habitId?: string;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0: None, 1: Very Low, 2: Low, 3: Medium, 4: High
}

export interface CategoryStats {
  category: string;
  completionPercentage: number;
  habitCount: number;
  timeInvested: number; // in minutes
}

export interface ChartDataPoint {
  label: string; // e.g. "Mon", "Jan", etc.
  date?: string;
  completed: number;
  missed: number;
  value: number; // duration or count depending on habit
}
