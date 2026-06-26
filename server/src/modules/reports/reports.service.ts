import { WeeklyEngine } from './engine/weekly.engine';
import { MonthlyEngine } from './engine/monthly.engine';
import { YearlyEngine } from './engine/yearly.engine';
import { Habit } from '../habit/models/Habit';
import { HabitLog } from '../habit/models/HabitLog';
import { User } from '../auth/models/User';
import { WeeklyReportDTO, MonthlyReportDTO, YearlyReportDTO } from './reports.types';

export class ReportsService {
  static async getWeeklyReport(userId: string, timezone: string): Promise<WeeklyReportDTO> {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    const from = weekAgo.toLocaleDateString('en-CA', { timeZone: timezone });
    const to = today.toLocaleDateString('en-CA', { timeZone: timezone });

    const [activeHabits, weeklyLogs, user] = await Promise.all([
      Habit.find({ userId, status: 'active', deletedAt: null }).lean(),
      HabitLog.find({ userId, date: { $gte: from, $lte: to } }).lean(),
      User.findById(userId).lean(),
    ]);

    return WeeklyEngine.generate(userId, activeHabits, weeklyLogs, user?.statistics, timezone);
  }

  static async getMonthlyReport(userId: string, timezone: string): Promise<MonthlyReportDTO> {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 29);
    const from = monthAgo.toLocaleDateString('en-CA', { timeZone: timezone });
    const to = today.toLocaleDateString('en-CA', { timeZone: timezone });

    const [activeHabits, monthlyLogs, user] = await Promise.all([
      Habit.find({ userId, status: 'active', deletedAt: null }).lean(),
      HabitLog.find({ userId, date: { $gte: from, $lte: to } }).lean(),
      User.findById(userId).lean(),
    ]);

    return MonthlyEngine.generate(userId, activeHabits, monthlyLogs, user?.statistics, timezone);
  }

  static async getYearlyReport(userId: string, timezone: string): Promise<YearlyReportDTO> {
    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1);
    const from = yearAgo.toLocaleDateString('en-CA', { timeZone: timezone });
    const to = today.toLocaleDateString('en-CA', { timeZone: timezone });

    const [activeHabits, yearlyLogs, user] = await Promise.all([
      Habit.find({ userId, status: 'active', deletedAt: null }).lean(),
      HabitLog.find({ userId, date: { $gte: from, $lte: to } }).lean(),
      User.findById(userId).lean(),
    ]);

    return YearlyEngine.generate(userId, activeHabits, yearlyLogs, user?.statistics, timezone);
  }
}
