import { InsightEvidence, InsightSeverity, RuleResult } from '../insights.types';
import { INSIGHT_CONFIDENCE, BURN_OUT_THRESHOLDS } from '../insights.constants';

export class BurnoutRules {
  static evaluateMissRate(
    recentMissRate: number, 
    totalHabits: number,
    abandonedHabits: number
  ): RuleResult | null {
    if (recentMissRate === 0) return null;

    let severity: InsightSeverity = 'low';
    let burnoutLevel = 'low';
    let confidence = INSIGHT_CONFIDENCE.MEDIUM;
    let recommendation = 'Keep up the balanced routine.';

    if (recentMissRate >= BURN_OUT_THRESHOLDS.CRITICAL_MISS_RATE) {
      severity = 'critical';
      burnoutLevel = 'critical';
      confidence = INSIGHT_CONFIDENCE.VERY_HIGH;
      recommendation = 'You are missing most of your habits. Consider pausing some habits or significantly reducing your daily goals to recover.';
    } else if (recentMissRate >= BURN_OUT_THRESHOLDS.HIGH_MISS_RATE) {
      severity = 'high';
      burnoutLevel = 'high';
      confidence = INSIGHT_CONFIDENCE.HIGH;
      recommendation = 'High number of missed habits detected. Focus only on 1 or 2 core habits until consistency returns.';
    } else if (recentMissRate >= BURN_OUT_THRESHOLDS.MODERATE_MISS_RATE) {
      severity = 'medium';
      burnoutLevel = 'moderate';
      confidence = INSIGHT_CONFIDENCE.MEDIUM;
      recommendation = 'You are starting to miss more habits than usual. Make sure your workload is manageable.';
    } else {
      return null;
    }

    // Adjust confidence based on sample size
    if (totalHabits < 3) {
      confidence -= 10;
    }

    const evidence: InsightEvidence[] = [
      { metric: 'Recent Miss Rate', value: `${(recentMissRate * 100).toFixed(0)}%` }
    ];

    if (abandonedHabits > 0) {
      evidence.push({ metric: 'Abandoned Habits', value: abandonedHabits, comparison: 'Recently stopped tracking' });
    }

    return {
      category: 'burnout',
      title: 'Burnout Warning',
      description: `Detected a ${burnoutLevel} risk of burnout based on recent completion rates.`,
      severity,
      confidence,
      recommendation,
      evidence
    };
  }
}
