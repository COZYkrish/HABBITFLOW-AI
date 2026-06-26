import { InsightEvidence, InsightSeverity, RuleResult } from '../insights.types';
import { INSIGHT_CONFIDENCE } from '../insights.constants';

export class ScheduleRules {
  static evaluateBestTimeOfDay(
    timeOfDayStats: Record<string, number>,
    totalCompletions: number
  ): RuleResult | null {
    if (totalCompletions < 5) return null; // Not enough data

    let bestTime = '';
    let maxCount = -1;

    for (const [time, count] of Object.entries(timeOfDayStats)) {
      if (count > maxCount) {
        maxCount = count;
        bestTime = time;
      }
    }

    if (maxCount === 0 || !bestTime) return null;

    const percentage = ((maxCount / totalCompletions) * 100).toFixed(0);
    const confidence = totalCompletions > 20 ? INSIGHT_CONFIDENCE.VERY_HIGH : INSIGHT_CONFIDENCE.MEDIUM;

    const evidence: InsightEvidence[] = [
      { metric: 'Completions in ' + bestTime, value: `${percentage}%` },
      { metric: 'Total logs analyzed', value: totalCompletions }
    ];

    return {
      category: 'schedule',
      title: 'Optimal Productivity Window',
      description: `You are most productive during the ${bestTime}.`,
      severity: 'info',
      confidence,
      recommendation: `Schedule your most difficult habits during the ${bestTime} when your completion rate is highest.`,
      evidence
    };
  }

  static evaluateBestWeekday(
    weekdayStats: Record<string, number>,
    totalCompletions: number
  ): RuleResult | null {
    if (totalCompletions < 7) return null;

    let bestDay = '';
    let maxCount = -1;
    let worstDay = '';
    let minCount = Infinity;

    for (const [day, count] of Object.entries(weekdayStats)) {
      if (count > maxCount) {
        maxCount = count;
        bestDay = day;
      }
      if (count < minCount) {
        minCount = count;
        worstDay = day;
      }
    }

    if (!bestDay || !worstDay) return null;

    const confidence = totalCompletions > 30 ? INSIGHT_CONFIDENCE.HIGH : INSIGHT_CONFIDENCE.LOW;

    const evidence: InsightEvidence[] = [
      { metric: 'Most productive day', value: bestDay, comparison: `${maxCount} completions` },
      { metric: 'Least productive day', value: worstDay, comparison: `${minCount} completions` }
    ];

    return {
      category: 'schedule',
      title: 'Weekly Productivity Rhythm',
      description: `${bestDay} is your strongest day, while ${worstDay} is your weakest.`,
      severity: 'info',
      confidence,
      recommendation: `Consider reducing your habit load on ${worstDay}, or front-loading important tasks on ${bestDay}.`,
      evidence
    };
  }
}
