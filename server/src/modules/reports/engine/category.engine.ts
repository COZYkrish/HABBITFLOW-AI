import { ReportCategoryPerformanceDTO } from '../reports.types';

export class CategoryEngine {
  static analyze(logs: any[], habits: any[]): ReportCategoryPerformanceDTO[] {
    const categoryMap: Record<string, { completed: number; total: number; time: number }> = {};

    // Initialize map
    habits.forEach((h) => {
      const cat = h.category || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = { completed: 0, total: 0, time: 0 };
    });

    // Populate data
    logs.forEach((l) => {
      const habit = habits.find((h) => String(h._id) === String(l.habitId));
      if (!habit) return;
      const cat = habit.category || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = { completed: 0, total: 0, time: 0 };
      
      categoryMap[cat].total += 1;
      if (l.completed) {
        categoryMap[cat].completed += 1;
        categoryMap[cat].time += (habit.estimatedDuration || 0);
      }
    });

    return Object.entries(categoryMap).map(([category, stats]) => ({
      category,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      timeInvested: stats.time,
      improvement: 0,
    }));
  }
}
