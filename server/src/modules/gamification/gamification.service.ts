import { gamificationRepository } from './gamification.repository';
import { processRewardPipeline } from './engine/reward.engine';
import { XPEventData } from './types/gamification.types';

export class GamificationService {
  async getProfile(userId: string) {
    return gamificationRepository.getUserProfile(userId);
  }

  async getAchievements(userId: string) {
    return gamificationRepository.getUserAchievements(userId);
  }

  async getChallenges(userId: string) {
    return gamificationRepository.getActiveChallenges(userId);
  }

  async getDailyGoal(userId: string) {
    return gamificationRepository.getDailyGoal(userId);
  }

  async getHistory(userId: string) {
    return gamificationRepository.getProgressHistory(userId);
  }

  // Exposed for other modules (e.g. Habit completion) to trigger rewards
  async dispatchXPEvent(event: XPEventData) {
    return processRewardPipeline(event);
  }
}

export const gamificationService = new GamificationService();
