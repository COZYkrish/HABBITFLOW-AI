import { Types } from 'mongoose';
import { XPEventData, RewardSummary } from '../types/gamification.types';
import { processXPEvent } from './xp.engine';
import { processLevelUp } from './level.engine';
import { evaluateAchievements } from './achievement.pipeline';
import { evaluateMilestones } from './milestone.engine';
import { evaluateChallenges } from './challenge.engine';
import { generateCelebrations, CelebrationEvent } from './celebration.engine';
import { ProgressHistoryModel } from '../models/ProgressHistory';

export const processRewardPipeline = async (
  event: XPEventData
): Promise<{ summary: RewardSummary; celebrations: CelebrationEvent[] }> => {
  
  // 1. Calculate XP
  const { userXP, xpGained } = await processXPEvent(event);

  // 2. Evaluate Achievements
  const unlockedAchievements = await evaluateAchievements(event);

  // 3. Evaluate Milestones & Challenges
  const reachedMilestones = await evaluateMilestones(event.userId, event);
  const completedChallenges = await evaluateChallenges(event.userId, event);

  // 4. Calculate Level Up (after potentially getting bonus XP from achievements/challenges)
  // For simplicity here, we assume standard XP already includes those, or we'd processXPEvent again.
  const { leveledUp, newLevel } = await processLevelUp(userXP);

  // 5. Generate Celebrations
  const celebrations = generateCelebrations(
    leveledUp ? newLevel : undefined,
    unlockedAchievements,
    reachedMilestones,
    completedChallenges
  );

  // 6. Log Progress History
  if (xpGained > 0) {
    await ProgressHistoryModel.create({
      userId: new Types.ObjectId(event.userId),
      eventType: 'xp_earned',
      description: `Earned ${xpGained} XP from ${event.action}`,
      xpEarned: xpGained,
      metadata: event.metadata,
    });
  }

  if (leveledUp) {
    await ProgressHistoryModel.create({
      userId: new Types.ObjectId(event.userId),
      eventType: 'level_up',
      description: `Leveled up to ${newLevel}`,
      xpEarned: 0,
      metadata: { level: newLevel },
    });
  }

  for (const ach of unlockedAchievements) {
    await ProgressHistoryModel.create({
      userId: new Types.ObjectId(event.userId),
      eventType: 'achievement_unlocked',
      description: `Unlocked achievement: ${ach}`,
      xpEarned: 0, // In reality, we might add XP here for the achievement
      metadata: { achievementId: ach },
    });
  }

  return {
    summary: {
      xpEarned: xpGained,
      newLevel: leveledUp ? newLevel : undefined,
      achievementsUnlocked: unlockedAchievements,
      milestonesReached: reachedMilestones,
      challengesCompleted: completedChallenges,
    },
    celebrations,
  };
};
