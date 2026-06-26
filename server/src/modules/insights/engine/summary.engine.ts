import { IHabit } from '../../habit/models/Habit';
import { IHabitLog } from '../../habit/models/HabitLog';
import { SummaryRules } from '../rules/summary.rules';
import { WeeklySummaryDTO, MonthlySummaryDTO } from '../dto/insights.dto';

export class SummaryEngine {
  static analyzeWeekly(habits: IHabit[], recentLogs: IHabitLog[]): WeeklySummaryDTO {
    const completedLogs = recentLogs.filter(l => l.completed);
    
    let habitsCompleted = completedLogs.length;
    let expected = habits.length * 7;
    let completionPercentage = expected > 0 ? (habitsCompleted / expected) * 100 : 0;
    
    // Find strongest and weakest
    const habitStats = new Map<string, number>();
    habits.forEach(h => habitStats.set(h.title, 0));
    completedLogs.forEach(log => {
      const habit = habits.find(h => h._id.toString() === log.habitId.toString());
      if (habit) {
        habitStats.set(habit.title, (habitStats.get(habit.title) || 0) + 1);
      }
    });

    let strongestHabit = null;
    let weakestHabit = null;
    let max = -1, min = Infinity;

    habitStats.forEach((count, title) => {
      if (count > max) { max = count; strongestHabit = title; }
      if (count < min) { min = count; weakestHabit = title; }
    });

    let longestStreak = 0;
    habits.forEach(h => {
      if ((h.statistics?.longestStreak || 0) > longestStreak) longestStreak = h.statistics?.longestStreak || 0;
    });

    // Best day
    const dayStats = new Map<string, number>();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    completedLogs.forEach(l => {
      const day = weekdays[new Date(l.date).getUTCDay()];
      dayStats.set(day, (dayStats.get(day) || 0) + 1);
    });

    let mostProductiveDay = null;
    let dMax = -1;
    dayStats.forEach((count, day) => {
      if (count > dMax) { dMax = count; mostProductiveDay = day; }
    });

    return SummaryRules.generateWeeklySummary(
      habitsCompleted,
      completionPercentage,
      strongestHabit,
      weakestHabit,
      longestStreak,
      mostProductiveDay,
      weakestHabit
    );
  }

  static analyzeMonthly(habits: IHabit[], monthlyLogs: IHabitLog[]): MonthlySummaryDTO {
    // simplified implementation for monthly summary
    return SummaryRules.generateMonthlySummary(
      85, // mock productivity
      80, // mock consistency
      12, // 12% growth
      [{ category: 'Health', score: 90 }],
      habits[0]?.title || null,
      habits[habits.length - 1]?.title || null
    );
  }
}
