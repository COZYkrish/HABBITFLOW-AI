export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type InsightCategory = 'completion' | 'streak' | 'burnout' | 'consistency' | 'trend' | 'productivity' | 'recommendation' | 'schedule' | 'summary' | 'risk';
export type TrendDirection = 'increasing' | 'stable' | 'declining';

export interface InsightEvidence {
  metric: string;
  value: string | number;
  comparison?: string;
}

export interface RuleResult {
  id?: string;
  category: InsightCategory;
  title: string;
  description: string;
  severity: InsightSeverity;
  confidence: number;
  recommendation?: string;
  evidence: InsightEvidence[];
}
