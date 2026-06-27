export interface CelebrationEvent {
  type: 'LEVEL_UP' | 'ACHIEVEMENT_UNLOCKED' | 'MILESTONE_REACHED' | 'CHALLENGE_COMPLETED';
  title: string;
  subtitle: string;
  icon?: string;
  metadata?: any;
}

export const generateCelebrations = (
  newLevel: number | undefined,
  unlockedAchievements: string[],
  _reachedMilestones: string[],
  _completedChallenges: string[]
): CelebrationEvent[] => {
  const events: CelebrationEvent[] = [];

  if (newLevel) {
    events.push({
      type: 'LEVEL_UP',
      title: `Level ${newLevel}!`,
      subtitle: 'You are leveling up.',
      metadata: { level: newLevel },
    });
  }

  for (const achievementId of unlockedAchievements) {
    events.push({
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'Achievement Unlocked',
      subtitle: achievementId, // Usually you'd map this to the real title
      metadata: { achievementId },
    });
  }

  // Same for milestones and challenges...

  return events;
};
