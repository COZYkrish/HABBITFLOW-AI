import { InsightsRepository } from './insights.repository';
import { BurnoutEngine } from './engine/burnout.engine';
import { ProductivityEngine } from './engine/productivity.engine';
import { RecommendationEngine } from './engine/recommendation.engine';
import { RiskEngine } from './engine/risk.engine';
import { ScheduleEngine } from './engine/schedule.engine';
import { SummaryEngine } from './engine/summary.engine';

export class InsightsService {
  /**
   * Generates a complete overview of all insights for a user.
   */
  static async getOverview(userId: string) {
    const habits = await InsightsRepository.getUserHabits(userId);
    
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const monthlyLogs = await InsightsRepository.getUserLogs(userId, thirtyDaysAgo, todayStr);
    const weeklyLogs = monthlyLogs.filter(l => l.date >= sevenDaysAgo);

    const burnout = BurnoutEngine.analyze(habits, weeklyLogs);
    const productivity = ProductivityEngine.analyze(habits, monthlyLogs);
    const schedule = ScheduleEngine.analyze(monthlyLogs);
    const risk = RiskEngine.analyze(habits, weeklyLogs);
    const recommendations = RecommendationEngine.analyze(habits, monthlyLogs, schedule);
    const weeklySummary = SummaryEngine.analyzeWeekly(habits, weeklyLogs);

    // Filter out nulls and combine for a top-level "Insights" list
    const activeInsights = [burnout, schedule, risk].filter(Boolean);
    
    // Sort by priority descending
    activeInsights.sort((a, b) => (b!.priority || 0) - (a!.priority || 0));

    return {
      activeInsights,
      recommendations,
      productivity,
      weeklySummary
    };
  }
}
