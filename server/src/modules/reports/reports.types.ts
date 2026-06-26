/**
 * Reports Module — Shared TypeScript Types & DTOs
 */

export interface ReportExecutiveSummaryDTO {
  overallProductivity: number;
  consistencyScore: number;
  totalHabitsCompleted: number;
  xpEarned: number;
  biggestWin?: string;
  biggestChallenge?: string;
  recommendedFocus?: string;
}

export interface ReportCategoryPerformanceDTO {
  category: string;
  completionRate: number;
  timeInvested: number; // in minutes
  improvement?: number; // comparison %
}

export interface ReportStreakDTO {
  currentStreak: number;
  bestStreak: number;
  trend: 'up' | 'down' | 'stable';
  lostStreaks: number;
}

export interface ReportProductivityDTO {
  overallScore: number;
  consistency: number;
  completion: number;
  momentum: number;
  routineStability: number;
}

export interface ReportInsightDTO {
  title: string;
  description: string;
  type: 'recommendation' | 'alert' | 'praise' | 'observation';
  confidence: number;
}

export interface BaseReportDTO {
  id: string; // Report ID for history
  userId: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  summary: ReportExecutiveSummaryDTO;
  productivity: ReportProductivityDTO;
  categoryPerformance: ReportCategoryPerformanceDTO[];
  streaks: ReportStreakDTO;
  insights: ReportInsightDTO[];
  achievementsUnlocked: { id: string; name: string; icon: string }[];
}

export interface WeeklyReportDTO extends BaseReportDTO {
  type: 'weekly';
  dailyCompletionRates: number[]; // 7 days
}

export interface MonthlyReportDTO extends BaseReportDTO {
  type: 'monthly';
  monthlyHeatmap: number[]; // e.g., up to 31 days
  timeInvested: number;
}

export interface YearlyReportDTO extends BaseReportDTO {
  type: 'yearly';
  monthlyCompletionRates: number[]; // 12 months
  bestMonth: string;
  worstMonth: string;
}

export type AnyReportDTO = WeeklyReportDTO | MonthlyReportDTO | YearlyReportDTO;
