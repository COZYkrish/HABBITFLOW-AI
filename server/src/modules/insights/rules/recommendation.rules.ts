import { InsightEvidence, RuleResult } from '../insights.types';
import { INSIGHT_CONFIDENCE } from '../insights.constants';

export class RecommendationRules {
  static generateTimeShiftRecommendation(
    habitName: string,
    currentUsualTime: string,
    bestOverallTime: string
  ): RuleResult {
    const evidence: InsightEvidence[] = [
      { metric: 'Current Usual Time', value: currentUsualTime },
      { metric: 'Your Most Productive Time', value: bestOverallTime }
    ];

    return {
      category: 'recommendation',
      title: 'Optimize Habit Timing',
      description: `Consider moving ${habitName} to the ${bestOverallTime.toLowerCase()}.`,
      severity: 'info',
      confidence: INSIGHT_CONFIDENCE.HIGH,
      recommendation: `Move ${habitName} to the ${bestOverallTime.toLowerCase()} to align with your natural productivity peak.`,
      evidence
    };
  }

  static generateConsistencyRecommendation(
    habitName: string,
    completionRate: number
  ): RuleResult {
    const evidence: InsightEvidence[] = [
      { metric: 'Current Completion Rate', value: `${(completionRate * 100).toFixed(0)}%` }
    ];

    return {
      category: 'recommendation',
      title: 'Focus on Consistency',
      description: `${habitName} is struggling with consistency.`,
      severity: 'medium',
      confidence: INSIGHT_CONFIDENCE.MEDIUM,
      recommendation: `Reduce the scope or duration of ${habitName} temporarily until you build a solid daily routine.`,
      evidence
    };
  }
}
