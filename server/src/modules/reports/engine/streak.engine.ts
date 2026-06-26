import { ReportStreakDTO } from '../reports.types';

export class StreakEngine {
  static analyze(currentStreak: number, bestStreak: number, historicalLogs: any[]): ReportStreakDTO {
    // Advanced trend analysis would go here.
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (currentStreak > bestStreak * 0.8) trend = 'up';
    if (currentStreak === 0) trend = 'down';

    return {
      currentStreak,
      bestStreak,
      trend,
      lostStreaks: 0, // Mock for now
    };
  }
}
