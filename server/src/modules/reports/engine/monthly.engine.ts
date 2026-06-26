import { MonthlyReportDTO, YearlyReportDTO } from '../reports.types';
import { SummaryEngine } from './summary.engine';
import { ProductivityEngine } from './productivity.engine';
import { CategoryEngine } from './category.engine';
import { StreakEngine } from './streak.engine';
import crypto from 'crypto';

export class MonthlyEngine {
  static async generate(
    userId: string,
    activeHabits: any[],
    monthlyLogs: any[],
    userStats: any,
    timezone: string
  ): Promise<MonthlyReportDTO> {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 29);

    const completed = monthlyLogs.filter((l) => l.completed).length;
    const totalPossible = activeHabits.length * 30;
    const xpEarned = completed * 10;

    const monthlyHeatmap: number[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA', { timeZone: timezone });
      const dayLogs = monthlyLogs.filter((l) => l.date === dateStr);
      const dayCompleted = dayLogs.filter((l) => l.completed).length;
      const rate = activeHabits.length > 0 ? Math.round((dayCompleted / activeHabits.length) * 100) : 0;
      monthlyHeatmap.push(rate);
    }

    const productivity = ProductivityEngine.calculate(monthlyLogs, activeHabits.length, 30);
    const categoryStats = CategoryEngine.analyze(monthlyLogs, activeHabits);
    const timeInvested = categoryStats.reduce((sum, cat) => sum + cat.timeInvested, 0);

    return {
      id: `mr_${crypto.randomUUID()}`,
      type: 'monthly',
      userId,
      generatedAt: new Date().toISOString(),
      periodStart: monthAgo.toISOString(),
      periodEnd: today.toISOString(),
      summary: SummaryEngine.generate(completed, totalPossible, xpEarned, productivity.overallScore, productivity.consistency),
      productivity,
      categoryPerformance: categoryStats,
      streaks: StreakEngine.analyze(userStats?.currentStreak || 0, userStats?.longestStreak || 0, monthlyLogs),
      insights: [],
      achievementsUnlocked: [],
      monthlyHeatmap,
      timeInvested,
    };
  }
}


