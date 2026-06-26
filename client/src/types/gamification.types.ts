export interface CelebrationEvent {
  type: 'LEVEL_UP' | 'ACHIEVEMENT_UNLOCKED' | 'MILESTONE_REACHED' | 'CHALLENGE_COMPLETED';
  title: string;
  subtitle: string;
  icon?: string;
  metadata?: any;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: string;
  xpReward: number;
  isHidden: boolean;
  target: number;
  currentProgress?: number;
  percentageComplete?: number;
  unlocked?: boolean;
}
