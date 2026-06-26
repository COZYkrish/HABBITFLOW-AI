import { HeatmapDTO } from '../dto/analytics.dto';
import { AnalyticsEngine } from './analytics.engine';

export class HeatmapEngine {
  static generateHeatmap(year: number, aggregationResult: { _id: string; count: number }[]): HeatmapDTO {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const dates = AnalyticsEngine.getDatesInRange(startDate, endDate);

    const lookup = new Map<string, number>();
    aggregationResult.forEach(item => lookup.set(item._id, item.count));

    let totalCompletions = 0;

    const days = dates.map(date => {
      const count = lookup.get(date) || 0;
      totalCompletions += count;

      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 1) intensity = 1;
      else if (count === 2) intensity = 2;
      else if (count === 3) intensity = 3;
      else if (count >= 4) intensity = 4;

      return {
        date,
        count,
        intensity
      };
    });

    return {
      year,
      totalCompletions,
      days
    };
  }
}
