import { Types } from 'mongoose';
import { UserXPModel } from './models/UserXP';
import { UserAchievementModel } from './models/UserAchievement';
import { UserChallengeModel } from './models/UserChallenge';
import { DailyGoalModel } from './models/DailyGoal';
import { ProgressHistoryModel } from './models/ProgressHistory';
import { ACHIEVEMENTS } from './constants/achievement.constants';
import { AchievementDefinition } from './types/gamification.types';

export class GamificationRepository {
  async getUserProfile(userId: string) {
    let profile = await UserXPModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) {
      profile = await UserXPModel.create({ userId: new Types.ObjectId(userId) });
    }
    return profile;
  }

  async getUserAchievements(userId: string) {
    const userAchievements = await UserAchievementModel.find({ userId: new Types.ObjectId(userId) }).lean();
    
    // Map to full definitions so frontend doesn't need to know all definitions
    return Object.values(ACHIEVEMENTS).map((def: AchievementDefinition) => {
      const ua = userAchievements.find((a: any) => a.achievementId === def.id);
      return {
        ...def,
        currentProgress: ua ? ua.currentProgress : 0,
        percentageComplete: ua ? ua.percentageComplete : 0,
        unlocked: ua ? ua.unlocked : false,
        unlockedAt: ua ? ua.unlockedAt : null,
      };
    });
  }

  async getActiveChallenges(userId: string) {
    return UserChallengeModel.find({
      userId: new Types.ObjectId(userId),
      status: 'active'
    });
  }

  async getDailyGoal(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    return DailyGoalModel.findOne({
      userId: new Types.ObjectId(userId),
      date: today
    });
  }

  async getProgressHistory(userId: string, limit = 50) {
    return ProgressHistoryModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export const gamificationRepository = new GamificationRepository();
