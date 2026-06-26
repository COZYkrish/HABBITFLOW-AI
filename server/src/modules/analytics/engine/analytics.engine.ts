export class AnalyticsEngine {
  /**
   * Helper to get dates between two dates.
   */
  static getDatesInRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  static calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  }
}
