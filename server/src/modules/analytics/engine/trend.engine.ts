import { TrendDirection } from '../analytics.types';

export class TrendEngine {
  static calculateTrend(currentPeriodValue: number, previousPeriodValue: number): TrendDirection {
    if (previousPeriodValue === 0 && currentPeriodValue > 0) return 'up';
    if (previousPeriodValue === 0 && currentPeriodValue === 0) return 'stable';

    const ratio = currentPeriodValue / previousPeriodValue;
    
    // Within 5% difference is considered stable
    if (ratio >= 0.95 && ratio <= 1.05) return 'stable';
    if (ratio > 1.05) return 'up';
    return 'down';
  }
}
