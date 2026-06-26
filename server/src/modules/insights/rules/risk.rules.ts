import { InsightEvidence, RuleResult } from '../insights.types';
import { INSIGHT_CONFIDENCE, STREAK_RISK_THRESHOLDS } from '../insights.constants';

export class RiskRules {
  static evaluateStreakRisk(
    missedDays: number,
    habitName: string,
    currentStreak: number
  ): RuleResult | null {
    if (missedDays === 0 || currentStreak === 0) return null;

    let riskLevel = 'Low Risk';
    let severity: 'medium' | 'high' | 'critical' = 'medium';
    let recommendation = '';

    if (missedDays >= STREAK_RISK_THRESHOLDS.HIGH_RISK_DAYS) {
      riskLevel = 'High Risk';
      severity = 'critical';
      recommendation = `You've missed ${missedDays} days of ${habitName}. Complete it today to save your momentum!`;
    } else if (missedDays === STREAK_RISK_THRESHOLDS.MEDIUM_RISK_DAYS) {
      riskLevel = 'Medium Risk';
      severity = 'high';
      recommendation = `Don't break the chain! You missed yesterday's ${habitName}.`;
    } else {
      return null;
    }

    const evidence: InsightEvidence[] = [
      { metric: 'Missed Days', value: missedDays },
      { metric: 'Habit at Risk', value: habitName },
      { metric: 'Current Streak', value: currentStreak }
    ];

    return {
      category: 'risk',
      title: 'Streak at Risk',
      description: `Your ${habitName} streak is at ${riskLevel.toLowerCase()}.`,
      severity,
      confidence: INSIGHT_CONFIDENCE.VERY_HIGH,
      recommendation,
      evidence
    };
  }
}
