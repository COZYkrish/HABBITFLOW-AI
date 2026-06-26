export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type AchievementCategory = 'consistency' | 'streaks' | 'fitness' | 'reading' | 'coding' | 'meditation' | 'learning' | 'health' | 'special' | 'hidden';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  category: AchievementCategory;
  xpReward: number;
  isHidden: boolean;
  target: number; // e.g., 30 for a 30-day streak
}

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type ChallengeStatus = 'active' | 'completed' | 'expired' | 'failed';

export interface XPEventData {
  userId: string;
  action: string;
  xpAmount: number;
  metadata?: Record<string, any>;
}

export interface RewardSummary {
  xpEarned: number;
  newLevel?: number;
  achievementsUnlocked: string[]; // achievement IDs
  milestonesReached: string[];
  challengesCompleted: string[];
}
