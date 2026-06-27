
import { ACHIEVEMENTS } from '../constants/achievement.constants';
import { XPEventData } from '../types/gamification.types';

export type AchievementEvaluator = (
  userId: string,
  event: XPEventData,
  currentProgress: number,
  targetProgress: number
) => Promise<{ newProgress: number; unlocked: boolean }>;

class AchievementRegistry {
  private evaluators: Map<string, AchievementEvaluator> = new Map();

  register(achievementId: string, evaluator: AchievementEvaluator) {
    if (!ACHIEVEMENTS[achievementId]) {
      throw new Error(`Achievement ${achievementId} is not defined in constants.`);
    }
    this.evaluators.set(achievementId, evaluator);
  }

  getEvaluator(achievementId: string): AchievementEvaluator | undefined {
    return this.evaluators.get(achievementId);
  }

  getAllRegisteredAchievementIds(): string[] {
    return Array.from(this.evaluators.keys());
  }
}

export const achievementRegistry = new AchievementRegistry();

// --- Register basic rules here or in a separate file ---

achievementRegistry.register('FIRST_HABIT', async (userId, event, currentProgress, _targetProgress) => {
  if (event.action === 'HABIT_COMPLETED') {
    return { newProgress: 1, unlocked: true };
  }
  return { newProgress: currentProgress, unlocked: false };
});

achievementRegistry.register('STREAK_7', async (userId, event, currentProgress, targetProgress) => {
  if (event.action === 'STREAK_UPDATED' && event.metadata?.streak >= 7) {
    return { newProgress: 7, unlocked: true };
  }
  // If just a habit completed, we might increment progress based on metadata
  if (event.action === 'HABIT_COMPLETED' && event.metadata?.streak) {
    const p = Math.min(event.metadata.streak, targetProgress);
    return { newProgress: p, unlocked: p >= targetProgress };
  }
  return { newProgress: currentProgress, unlocked: false };
});

achievementRegistry.register('STREAK_30', async (userId, event, currentProgress, targetProgress) => {
  if (event.action === 'HABIT_COMPLETED' && event.metadata?.streak) {
    const p = Math.min(event.metadata.streak, targetProgress);
    return { newProgress: p, unlocked: p >= targetProgress };
  }
  return { newProgress: currentProgress, unlocked: false };
});

achievementRegistry.register('STREAK_100', async (userId, event, currentProgress, targetProgress) => {
  if (event.action === 'HABIT_COMPLETED' && event.metadata?.streak) {
    const p = Math.min(event.metadata.streak, targetProgress);
    return { newProgress: p, unlocked: p >= targetProgress };
  }
  return { newProgress: currentProgress, unlocked: false };
});

achievementRegistry.register('EARLY_BIRD', async (userId, event, currentProgress, _targetProgress) => {
  if (event.action === 'HABIT_COMPLETED') {
    const hour = new Date().getHours();
    if (hour < 6) {
      return { newProgress: 1, unlocked: true };
    }
  }
  return { newProgress: currentProgress, unlocked: false };
});

achievementRegistry.register('NIGHT_OWL', async (userId, event, currentProgress, _targetProgress) => {
  if (event.action === 'HABIT_COMPLETED') {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 4) {
      return { newProgress: 1, unlocked: true };
    }
  }
  return { newProgress: currentProgress, unlocked: false };
});
