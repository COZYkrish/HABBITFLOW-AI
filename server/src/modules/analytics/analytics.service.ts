import { AnalyticsRepository } from './analytics.repository';
import { StreakEngine } from './engine/streak.engine';
import { ProductivityEngine } from './engine/productivity.engine';
import { HeatmapEngine } from './engine/heatmap.engine';
import { TrendEngine } from './engine/trend.engine';
import { CategoryEngine } from './engine/category.engine';
import { AnalyticsEngine } from './engine/analytics.engine';
import { AnalyticsFilters, ChartDataPoint, TrendDirection } from './analytics.types';
import { 
  AnalyticsOverviewDTO, 
  HeatmapDTO, 
  WeeklyAnalyticsDTO, 
  MonthlyAnalyticsDTO, 
  YearlyAnalyticsDTO, 
  CategoryAnalyticsDTO, 
  ProductivityDTO, 
  StreakDTO 
} from './dto/analytics.dto';

export class AnalyticsService {
  static async getOverview(userId: string, filters: AnalyticsFilters): Promise<AnalyticsOverviewDTO> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Total habits active
    const activeHabits = await AnalyticsRepository.getTotalHabitsCount(userId, filters);
    
    // Logs for today
    const logsToday = await AnalyticsRepository.getOverviewStats(userId, today);
    const totalLogsToday = logsToday.length;
    const completedToday = logsToday.filter(l => l.completed).length;
    
    const completionRate = AnalyticsEngine.calculatePercentage(completedToday, activeHabits);

    // Streaks (simplified across all habits)
    const allLogs = await AnalyticsRepository.getAllUserLogs(userId);
    const completedDates = allLogs.map(l => l.date);
    const streakInfo = StreakEngine.calculateStreaks(completedDates, today, yesterday);

    return {
      completionRate,
      activeHabits,
      totalLogsToday,
      currentStreak: streakInfo.currentStreak,
      bestStreak: streakInfo.bestStreak
    };
  }

  static async getHeatmap(userId: string, year: number): Promise<HeatmapDTO> {
    const data = await AnalyticsRepository.getHeatmapData(userId, year);
    return HeatmapEngine.generateHeatmap(year, data);
  }

  static async getWeeklyAnalytics(userId: string, startDate: string, endDate: string): Promise<WeeklyAnalyticsDTO> {
    const logs = await AnalyticsRepository.getLogsInRange(userId, startDate, endDate);
    
    // Previous week dates for trend
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    const prevEnd = new Date(sd.getTime() - 86400000).toISOString().split('T')[0];
    const prevStart = new Date(sd.getTime() - 7 * 86400000).toISOString().split('T')[0];
    
    const prevLogs = await AnalyticsRepository.getLogsInRange(userId, prevStart, prevEnd);
    
    const habitsCompleted = logs.filter(l => l.completed).length;
    const prevCompleted = prevLogs.filter(l => l.completed).length;
    
    const trend = TrendEngine.calculateTrend(habitsCompleted, prevCompleted);
    
    const activeHabits = await AnalyticsRepository.getTotalHabitsCount(userId, {}); // Approx for simplicity
    const expectedWeekCompletions = activeHabits * 7;
    const completionPercentage = AnalyticsEngine.calculatePercentage(habitsCompleted, expectedWeekCompletions);
    
    const dates = AnalyticsEngine.getDatesInRange(startDate, endDate);
    const chartData: ChartDataPoint[] = dates.map(date => {
      const dayLogs = logs.filter(l => l.date === date);
      const completed = dayLogs.filter(l => l.completed).length;
      return {
        label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        date,
        completed,
        missed: activeHabits - completed,
        value: dayLogs.reduce((acc, curr) => acc + (curr.value || 0), 0)
      };
    });

    // Best/Worst day
    let bestDay = '';
    let worstDay = '';
    let maxC = -1;
    let minC = Infinity;
    chartData.forEach(d => {
      if (d.completed > maxC) { maxC = d.completed; bestDay = d.date!; }
      if (d.completed < minC) { minC = d.completed; worstDay = d.date!; }
    });

    const averageDuration = chartData.reduce((acc, curr) => acc + curr.value, 0) / 7;

    return {
      startDate,
      endDate,
      completionPercentage,
      habitsCompleted,
      missedHabits: expectedWeekCompletions - habitsCompleted,
      averageDuration,
      bestDay,
      worstDay,
      trend,
      chartData
    };
  }

  static async getMonthlyAnalytics(userId: string, year: number, month: number): Promise<MonthlyAnalyticsDTO> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
    
    const logs = await AnalyticsRepository.getLogsInRange(userId, startDate, endDate);
    
    // We would calculate prev month for trend here
    const completionTrend = 'stable'; 

    const activeHabits = await AnalyticsRepository.getTotalHabitsCount(userId, {});
    const expected = activeHabits * lastDay;
    const completed = logs.filter(l => l.completed).length;
    const averageCompletion = AnalyticsEngine.calculatePercentage(completed, expected);

    // Chart Data by weeks or days, let's do days
    const dates = AnalyticsEngine.getDatesInRange(startDate, endDate);
    const chartData: ChartDataPoint[] = dates.map(date => {
      const dayLogs = logs.filter(l => l.date === date);
      return {
        label: new Date(date).getDate().toString(),
        date,
        completed: dayLogs.filter(l => l.completed).length,
        missed: activeHabits - dayLogs.filter(l => l.completed).length,
        value: dayLogs.reduce((acc, curr) => acc + (curr.value || 0), 0)
      };
    });

    const averageDuration = chartData.reduce((acc, curr) => acc + curr.value, 0) / lastDay;

    return {
      month,
      year,
      completionTrend,
      averageCompletion,
      longestStreak: 0, // Should be extracted specifically for the month
      averageDuration,
      chartData
    };
  }

  static async getYearlyAnalytics(userId: string, year: number): Promise<YearlyAnalyticsDTO> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const logs = await AnalyticsRepository.getLogsInRange(userId, startDate, endDate);
    
    const activeHabits = await AnalyticsRepository.getTotalHabitsCount(userId, {});
    
    const monthlyCompletions = new Array(12).fill(0);
    const chartData: ChartDataPoint[] = [];

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let m = 0; m < 12; m++) {
      const mStr = (m + 1).toString().padStart(2, '0');
      const mLogs = logs.filter(l => l.date.startsWith(`${year}-${mStr}`));
      const completed = mLogs.filter(l => l.completed).length;
      monthlyCompletions[m] = completed;
      
      const lastDay = new Date(year, m + 1, 0).getDate();
      chartData.push({
        label: monthLabels[m],
        completed,
        missed: (activeHabits * lastDay) - completed,
        value: mLogs.reduce((acc, curr) => acc + (curr.value || 0), 0)
      });
    }

    let bestMonth = '';
    let worstMonth = '';
    let max = -1;
    let min = Infinity;
    monthlyCompletions.forEach((val, i) => {
      if (val > max) { max = val; bestMonth = monthLabels[i]; }
      if (val < min) { min = val; worstMonth = monthLabels[i]; }
    });

    const expectedYearly = activeHabits * 365;
    const totalCompletions = logs.filter(l => l.completed).length;
    const yearlyConsistency = AnalyticsEngine.calculatePercentage(totalCompletions, expectedYearly);

    return {
      year,
      monthlyCompletions,
      bestMonth,
      worstMonth,
      yearlyStreak: 0,
      yearlyConsistency,
      chartData
    };
  }

  static async getCategories(userId: string, filters: AnalyticsFilters): Promise<CategoryAnalyticsDTO> {
    const data = await AnalyticsRepository.getCategoryDistribution(userId, filters);
    const total = data.reduce((acc, curr) => acc + curr.completions, 0);
    const categories = CategoryEngine.processCategories(data, total);
    return { categories };
  }

  static async getProductivity(userId: string, filters: AnalyticsFilters): Promise<ProductivityDTO> {
    const logs = await AnalyticsRepository.getLogsInRange(
      userId, 
      filters.startDate || '2000-01-01', 
      filters.endDate || '2100-01-01'
    );
    const completed = logs.filter(l => l.completed).length;
    const actualDuration = logs.reduce((acc, curr) => acc + (curr.value || 0), 0);
    
    const activeHabits = await AnalyticsRepository.getTotalHabitsCount(userId, filters);
    // Rough estimation of expected metrics
    const expected = activeHabits * 30; // assuming 30 days if not provided
    const expectedDuration = activeHabits * 15 * 30; // 15 mins avg

    return ProductivityEngine.calculateProductivity(expected, completed, expectedDuration, actualDuration);
  }

  static async getStreaks(userId: string): Promise<StreakDTO> {
    const allLogs = await AnalyticsRepository.getAllUserLogs(userId);
    const completedDates = allLogs.map(l => l.date);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    return StreakEngine.calculateStreaks(completedDates, today, yesterday);
  }
}
