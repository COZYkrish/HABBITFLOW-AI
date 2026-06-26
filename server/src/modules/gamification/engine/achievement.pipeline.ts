import { XPEventData } from '../types/gamification.types';
import { achievementRegistry } from './achievement.registry';
import { UserAchievementModel } from '../models/UserAchievement';
import { ACHIEVEMENTS } from '../constants/achievement.constants';
import { Types } from 'mongoose';

export const evaluateAchievements = async (event: XPEventData): Promise<string[]> => {
  const unlockedAchievementIds: string[] = [];
  const registeredIds = achievementRegistry.getAllRegisteredAchievementIds();

  // We could optimize this by only evaluating relevant achievements,
  // but for now, we evaluate all registered locked achievements.
  
  // Find all user achievements that are NOT unlocked yet
  const userAchievements = await UserAchievementModel.find({
    userId: new Types.ObjectId(event.userId),
    unlocked: false,
    achievementId: { $in: registeredIds }
  });

  // Create a map for quick lookup
  const uaMap = new Map(userAchievements.map(ua => [ua.achievementId, ua]));

  for (const achievementId of registeredIds) {
    const evaluator = achievementRegistry.getEvaluator(achievementId);
    if (!evaluator) continue;

    const def = ACHIEVEMENTS[achievementId];
    
    // Get existing progress or assume 0
    const ua = uaMap.get(achievementId);
    const currentProgress = ua ? ua.currentProgress : 0;
    
    // Evaluate
    const { newProgress, unlocked } = await evaluator(event.userId, event, currentProgress, def.target);
    
    if (newProgress !== currentProgress || unlocked) {
      const percentage = Math.min(100, Math.round((newProgress / def.target) * 100));
      
      await UserAchievementModel.findOneAndUpdate(
        { userId: new Types.ObjectId(event.userId), achievementId },
        {
          $set: {
            currentProgress: newProgress,
            targetProgress: def.target,
            percentageComplete: percentage,
            unlocked,
            unlockedAt: unlocked ? new Date() : undefined,
          }
        },
        { upsert: true, new: true }
      );

      if (unlocked) {
        unlockedAchievementIds.push(achievementId);
      }
    }
  }

  return unlockedAchievementIds;
};
