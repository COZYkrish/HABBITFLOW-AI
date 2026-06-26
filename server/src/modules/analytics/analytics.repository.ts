import mongoose from 'mongoose';
import { HabitLog } from '../habit/models/HabitLog';
import { Habit } from '../habit/models/Habit';
import { AnalyticsFilters } from './analytics.types';

export class AnalyticsRepository {
  /**
   * Base match for user and date range.
   */
  private static buildBaseMatch(userId: string, filters: AnalyticsFilters) {
    const match: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (filters.startDate || filters.endDate) {
      match.date = {};
      if (filters.startDate) match.date.$gte = filters.startDate;
      if (filters.endDate) match.date.$lte = filters.endDate;
    }
    if (filters.habitId) {
      match.habitId = new mongoose.Types.ObjectId(filters.habitId);
    }
    return match;
  }

  static async getOverviewStats(userId: string, todayString: string) {
    const match = { userId: new mongoose.Types.ObjectId(userId), date: todayString };
    const logs = await HabitLog.find(match).lean();
    return logs;
  }

  static async getLogsInRange(userId: string, startDate: string, endDate: string) {
    return HabitLog.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).lean();
  }

  static async getHeatmapData(userId: string, year: number) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
          completed: true,
        }
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 },
        }
      },
      {
        $sort: { _id: 1 as const }
      }
    ];

    return HabitLog.aggregate(pipeline);
  }

  static async getCategoryDistribution(userId: string, filters: AnalyticsFilters) {
    const match = this.buildBaseMatch(userId, filters);
    match.completed = true;

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'habits',
          localField: 'habitId',
          foreignField: '_id',
          as: 'habit'
        }
      },
      { $unwind: '$habit' },
      {
        $group: {
          _id: '$habit.category',
          habitCount: { $addToSet: '$habitId' },
          completions: { $sum: 1 },
          timeInvested: { 
            $sum: { 
              $cond: [
                { $eq: ['$habit.goalType', 'duration'] }, 
                { $ifNull: ['$value', '$habit.targetValue'] }, 
                '$habit.estimatedDuration'
              ] 
            } 
          }
        }
      },
      {
        $project: {
          category: '$_id',
          habitCount: { $size: '$habitCount' },
          completions: 1,
          timeInvested: 1,
          _id: 0
        }
      }
    ];

    return HabitLog.aggregate(pipeline);
  }

  static async getTotalHabitsCount(userId: string, filters: AnalyticsFilters) {
    const match: any = { userId: new mongoose.Types.ObjectId(userId), status: 'active' };
    if (filters.categoryId) match.category = filters.categoryId;
    return Habit.countDocuments(match);
  }

  static async getAllUserLogs(userId: string) {
    return HabitLog.find({ userId: new mongoose.Types.ObjectId(userId), completed: true })
      .sort({ date: 1 })
      .lean();
  }
}
