import { IHabit } from '../../habit/models/Habit';
import { IHabitLog } from '../../habit/models/HabitLog';
import { BurnoutRules } from '../rules/burnout.rules';
import { BurnoutDTO } from '../dto/insights.dto';
import { v4 as uuidv4 } from 'uuid';

export class BurnoutEngine {
  static analyze(habits: IHabit[], recentLogs: IHabitLog[]): BurnoutDTO | null {
    if (habits.length === 0 || recentLogs.length === 0) return null;

    // Calculate miss rate over the recent logs (e.g., last 7 days)
    const expectedCompletions = habits.length * 7; // simplified expectation for daily habits
    let actualCompletions = 0;
    
    // Determine how many unique habits were logged vs total
    recentLogs.forEach(log => {
      if (log.completed) {
        actualCompletions++;
      }
    });

    // In a real scenario, we should accurately map active days of each habit.
    // For now, if completion rate is very low, we flag burnout.
    const missRate = 1 - (actualCompletions / (expectedCompletions === 0 ? 1 : expectedCompletions));

    // Calculate abandoned habits (habits with 0 logs recently but active)
    const activeHabitIdsWithLogs = new Set(recentLogs.map(l => l.habitId.toString()));
    const abandonedHabits = habits.filter(h => !activeHabitIdsWithLogs.has(h._id.toString())).length;

    const ruleResult = BurnoutRules.evaluateMissRate(missRate, habits.length, abandonedHabits);

    if (!ruleResult) return null;

    let burnoutLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (ruleResult.severity === 'critical') burnoutLevel = 'critical';
    if (ruleResult.severity === 'high') burnoutLevel = 'high';
    if (ruleResult.severity === 'medium') burnoutLevel = 'moderate';

    return {
      id: ruleResult.id || uuidv4(),
      category: ruleResult.category,
      title: ruleResult.title,
      description: ruleResult.description,
      severity: ruleResult.severity,
      priority: ruleResult.severity === 'critical' ? 5 : ruleResult.severity === 'high' ? 4 : 3,
      confidence: ruleResult.confidence,
      recommendation: ruleResult.recommendation,
      evidence: ruleResult.evidence,
      burnoutLevel,
      createdAt: new Date().toISOString()
    };
  }
}
