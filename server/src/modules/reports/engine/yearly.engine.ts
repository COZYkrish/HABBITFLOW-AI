import { YearlyReportDTO } from '../reports.types';
import { SummaryEngine } from './summary.engine';
import { ProductivityEngine } from './productivity.engine';
import { CategoryEngine } from './category.engine';
import { StreakEngine } from './streak.engine';
import crypto from 'crypto';

export class YearlyEngine {
  static async generate(
    userId: string,
    activeHabits: any[],
    yearlyLogs: any[],
    userStats: any,
    timezone: string
  ): Promise<YearlyReportDTO> {
    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1);

    const completed = yearlyLogs.filter((l) => l.completed).length;
    const totalPossible = activeHabits.length * 365;
    const xpEarned = completed * 10;

    // Monthly rates mock
    const monthlyCompletionRates = Array(12).fill(0).map(() => Math.floor(Math.random() * 60) + 40);

    const productivity = ProductivityEngine.calculate(yearlyLogs, activeHabits.length, 365);

    return {
      id: `yr_${crypto.randomUUID()}`,
      type: 'yearly',
      userId,
      generatedAt: new Date().toISOString(),
      periodStart: yearAgo.toISOString(),
      periodEnd: today.toISOString(),
      summary: SummaryEngine.generate(completed, totalPossible, xpEarned, productivity.overallScore, productivity.consistency),
      productivity,
      categoryPerformance: CategoryEngine.analyze(yearlyLogs, activeHabits),
      streaks: StreakEngine.analyze(userStats?.currentStreak || 0, userStats?.longestStreak || 0, yearlyLogs),
      insights: [],
      achievementsUnlocked: [],
      monthlyCompletionRates,
      bestMonth: 'June',
      worstMonth: 'January',
    };
  }
}
