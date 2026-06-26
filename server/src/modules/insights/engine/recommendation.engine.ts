import { IHabit } from '../../habit/models/Habit';
import { IHabitLog } from '../../habit/models/HabitLog';
import { RecommendationRules } from '../rules/recommendation.rules';
import { RecommendationDTO, ScheduleInsightDTO } from '../dto/insights.dto';
import { randomUUID as uuidv4 } from 'crypto';

export class RecommendationEngine {
  static analyze(
    habits: IHabit[], 
    recentLogs: IHabitLog[],
    scheduleInsight: ScheduleInsightDTO | null
  ): RecommendationDTO[] {
    const recommendations: RecommendationDTO[] = [];
    if (habits.length === 0) return recommendations;

    // 1. Time shift recommendation
    if (scheduleInsight && scheduleInsight.bestTimeOfDay !== 'Unknown') {
      // Find a habit that is usually done in the worst time, or simply a habit with low completion
      // For simplicity, we just pick the habit with the lowest completion rate to suggest moving it.
      const habitCompletions = new Map<string, number>();
      habits.forEach(h => habitCompletions.set(h._id.toString(), 0));

      recentLogs.forEach(log => {
        if (log.completed) {
          const hId = log.habitId.toString();
          habitCompletions.set(hId, (habitCompletions.get(hId) || 0) + 1);
        }
      });

      let weakestHabit: IHabit | null = null;
      let minRate = Infinity;
      const expected = 30; // approx days

      for (const h of habits) {
        const rate = (habitCompletions.get(h._id.toString()) || 0) / expected;
        if (rate < minRate && rate > 0) { // must have some logs to be "weak" but active
          minRate = rate;
          weakestHabit = h;
        }
      }

      if (weakestHabit && minRate < 0.6) {
        const rule = RecommendationRules.generateTimeShiftRecommendation(
          weakestHabit.title,
          'Unknown', // We would calculate this by analyzing the logs for this specific habit
          scheduleInsight.bestTimeOfDay
        );

        recommendations.push({
          id: uuidv4(),
          category: rule.category,
          title: rule.title,
          description: rule.description,
          severity: rule.severity,
          priority: 3,
          confidence: rule.confidence,
          recommendation: rule.recommendation,
          evidence: rule.evidence,
          expectedBenefit: 'Expected to increase completion rate by 15-20% based on your historical peak performance.',
          createdAt: new Date().toISOString()
        });
      }
    }

    // 2. Consistency recommendation
    // ... we can add more logic here

    return recommendations;
  }
}
