import { HabitLog, IHabitLog } from '../habit/models/HabitLog';
import { Habit, IHabit } from '../habit/models/Habit';

export class InsightsRepository {
  /**
   * Fetch all habits for a user
   */
  static async getUserHabits(userId: string): Promise<IHabit[]> {
    return Habit.find({ userId, status: 'active' }).lean();
  }

  /**
   * Fetch all logs for a user within a date range
   */
  static async getUserLogs(userId: string, startDate: string, endDate: string): Promise<IHabitLog[]> {
    return HabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).lean();
  }

  /**
   * Fetch all logs for a user across all time
   */
  static async getAllUserLogs(userId: string): Promise<IHabitLog[]> {
    return HabitLog.find({ userId }).sort({ date: 1 }).lean();
  }
}
