import { IHabit } from '../../habit/models/Habit';
import { IHabitLog } from '../../habit/models/HabitLog';
import { ProductivityRules } from '../rules/productivity.rules';
import { ProductivityScoreDTO } from '../dto/insights.dto';

export class ProductivityEngine {
  static analyze(habits: IHabit[], recentLogs: IHabitLog[]): ProductivityScoreDTO {
    if (habits.length === 0) {
      return ProductivityRules.calculateScore(0, 0, 0, 0, 0);
    }

    const completedLogs = recentLogs.filter(l => l.completed);
    
    // 1. Completion Score (0-100)
    // Assume 30 days of logs. Expected = habits.length * 30
    const expectedCompletions = habits.length * 30;
    let completionScore = expectedCompletions > 0 
      ? (completedLogs.length / expectedCompletions) * 100 
      : 0;
    
    // Cap at 100
    completionScore = Math.min(100, completionScore);

    // 2. Consistency Score (0-100)
    // How many distinct days had at least one completion
    const distinctDays = new Set(completedLogs.map(l => l.date)).size;
    let consistencyScore = (distinctDays / 30) * 100;
    consistencyScore = Math.min(100, consistencyScore);

    // 3. Momentum Score (0-100)
    // Based on average streaks
    const avgStreak = habits.reduce((acc, h) => acc + (h.statistics?.currentStreak || 0), 0) / habits.length;
    let momentumScore = (avgStreak / 14) * 100; // Benchmark: 14 day streak is 100%
    momentumScore = Math.min(100, momentumScore);

    // 4. Routine Stability (0-100)
    // Standard deviation of completions per day? Simplified: 100 - variance penalty
    const completionsPerDay = new Map<string, number>();
    completedLogs.forEach(l => {
      completionsPerDay.set(l.date, (completionsPerDay.get(l.date) || 0) + 1);
    });
    const avgCompletionsPerDay = completedLogs.length / (distinctDays || 1);
    let variance = 0;
    completionsPerDay.forEach(count => {
      variance += Math.pow(count - avgCompletionsPerDay, 2);
    });
    variance = distinctDays > 0 ? variance / distinctDays : 0;
    let routineStability = 100 - (variance * 10);
    routineStability = Math.max(0, Math.min(100, routineStability));

    // 5. Time Efficiency (0-100)
    // Placeholder logic: 80% default + bonus if mostly intense?
    let intenseCount = completedLogs.filter(l => (l.value || 0) >= 3).length;
    let timeEfficiency = 70 + (intenseCount / (completedLogs.length || 1)) * 30;

    return ProductivityRules.calculateScore(
      consistencyScore,
      completionScore,
      momentumScore,
      routineStability,
      timeEfficiency
    );
  }
}
