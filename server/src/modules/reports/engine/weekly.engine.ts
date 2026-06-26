import { WeeklyReportDTO } from '../reports.types';
import { SummaryEngine } from './summary.engine';
import { ProductivityEngine } from './productivity.engine';
import { CategoryEngine } from './category.engine';
import { StreakEngine } from './streak.engine';
import crypto from 'crypto';

export class WeeklyEngine {
  static async generate(
    userId: string,
    activeHabits: any[],
    weeklyLogs: any[],
    userStats: any,
    timezone: string
  ): Promise<WeeklyReportDTO> {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const completed = weeklyLogs.filter((l) => l.completed).length;
    const totalPossible = activeHabits.length * 7;
    const xpEarned = completed * 10; // 10 XP per habit

    // Calculate Daily Rates
    const dailyCompletionRates: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA', { timeZone: timezone });
      const dayLogs = weeklyLogs.filter((l) => l.date === dateStr);
      const dayCompleted = dayLogs.filter((l) => l.completed).length;
      const rate = activeHabits.length > 0 ? Math.round((dayCompleted / activeHabits.length) * 100) : 0;
      dailyCompletionRates.push(rate);
    }

    const productivity = ProductivityEngine.calculate(weeklyLogs, activeHabits.length, 7);
    
    return {
      id: `wr_${crypto.randomUUID()}`,
      type: 'weekly',
      userId,
      generatedAt: new Date().toISOString(),
      periodStart: weekAgo.toISOString(),
      periodEnd: today.toISOString(),
      summary: SummaryEngine.generate(completed, totalPossible, xpEarned, productivity.overallScore, productivity.consistency),
      productivity,
      categoryPerformance: CategoryEngine.analyze(weeklyLogs, activeHabits),
      streaks: StreakEngine.analyze(userStats?.currentStreak || 0, userStats?.longestStreak || 0, weeklyLogs),
      insights: [
        { title: 'Great Consistency', description: 'You kept a solid routine.', type: 'praise', confidence: 0.9 }
      ],
      achievementsUnlocked: [],
      dailyCompletionRates,
    };
  }
}
