import { WeeklySummaryDTO, MonthlySummaryDTO } from '../dto/insights.dto';

export class SummaryRules {
  static generateWeeklySummary(
    habitsCompleted: number,
    completionPercentage: number,
    strongestHabit: string | null,
    weakestHabit: string | null,
    longestStreak: number,
    mostProductiveDay: string | null,
    habitRequiringAttention: string | null
  ): WeeklySummaryDTO {
    return {
      habitsCompleted,
      completionPercentage: Math.round(completionPercentage),
      strongestHabit,
      weakestHabit,
      longestStreak,
      mostProductiveDay,
      habitRequiringAttention
    };
  }

  static generateMonthlySummary(
    monthlyProductivity: number,
    consistencyScore: number,
    habitGrowth: number,
    categoryPerformance: Array<{ category: string; score: number }>,
    mostImprovedHabit: string | null,
    biggestDeclineHabit: string | null
  ): MonthlySummaryDTO {
    return {
      monthlyProductivity: Math.round(monthlyProductivity),
      consistencyScore: Math.round(consistencyScore),
      habitGrowth: Math.round(habitGrowth),
      categoryPerformance,
      mostImprovedHabit,
      biggestDeclineHabit
    };
  }
}
