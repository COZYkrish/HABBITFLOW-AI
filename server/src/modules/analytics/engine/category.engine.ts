import { CategoryStats } from '../analytics.types';
import { AnalyticsEngine } from './analytics.engine';

export class CategoryEngine {
  static processCategories(aggregationResult: any[], totalCompletions: number): CategoryStats[] {
    return aggregationResult.map(item => {
      const percentage = AnalyticsEngine.calculatePercentage(item.completions, totalCompletions);
      return {
        category: item.category,
        completionPercentage: percentage,
        habitCount: item.habitCount,
        timeInvested: item.timeInvested || 0,
      };
    });
  }
}
