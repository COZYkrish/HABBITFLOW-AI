import { InsightCategory, InsightSeverity, InsightEvidence, TrendDirection } from '../insights.types';

export interface InsightDTO {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  severity: InsightSeverity;
  priority: number; // 1 (lowest) to 5 (highest)
  confidence: number;
  recommendation?: string;
  evidence: InsightEvidence[];
  createdAt: string;
}

export interface RecommendationDTO extends InsightDTO {
  expectedBenefit: string;
}

export interface BurnoutDTO extends InsightDTO {
  burnoutLevel: 'low' | 'moderate' | 'high' | 'critical';
}

export interface CompletionTrendDTO extends InsightDTO {
  trend: TrendDirection;
  percentageChange: number;
}

export interface ProductivityScoreDTO {
  overallScore: number;
  consistencyScore: number;
  completionScore: number;
  momentumScore: number;
  routineStability: number;
  timeEfficiency: number;
  reasoning: string;
}

export interface WeeklySummaryDTO {
  habitsCompleted: number;
  completionPercentage: number;
  strongestHabit: string | null;
  weakestHabit: string | null;
  longestStreak: number;
  mostProductiveDay: string | null;
  habitRequiringAttention: string | null;
}

export interface MonthlySummaryDTO {
  monthlyProductivity: number;
  consistencyScore: number;
  habitGrowth: number; // percentage
  categoryPerformance: Array<{ category: string; score: number }>;
  mostImprovedHabit: string | null;
  biggestDeclineHabit: string | null;
}

export interface ScheduleInsightDTO extends InsightDTO {
  bestTimeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Unknown';
  mostProductiveWeekday: string;
  leastProductiveWeekday: string;
}

export interface RiskAssessmentDTO extends InsightDTO {
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  affectedHabits: string[];
}
