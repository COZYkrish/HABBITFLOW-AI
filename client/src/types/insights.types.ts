export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type InsightCategory = 'completion' | 'streak' | 'burnout' | 'consistency' | 'trend' | 'productivity' | 'recommendation' | 'schedule' | 'summary' | 'risk';
export type TrendDirection = 'increasing' | 'stable' | 'declining';

export interface InsightEvidence {
  metric: string;
  value: string | number;
  comparison?: string;
}

export interface InsightDTO {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  severity: InsightSeverity;
  priority: number;
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

export interface OverviewResponse {
  activeInsights: InsightDTO[];
  recommendations: RecommendationDTO[];
  productivity: ProductivityScoreDTO;
  weeklySummary: WeeklySummaryDTO;
}
