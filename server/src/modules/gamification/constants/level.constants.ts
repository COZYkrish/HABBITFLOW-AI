/**
 * Level progression rules.
 * Uses a progressive difficulty scale (not purely linear).
 */
export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 250 },
  { level: 3, xpRequired: 700 },
  { level: 4, xpRequired: 1400 },
  { level: 5, xpRequired: 2400 },
  { level: 6, xpRequired: 3800 },
  { level: 7, xpRequired: 5700 },
  { level: 8, xpRequired: 8200 },
  { level: 9, xpRequired: 11500 },
  { level: 10, xpRequired: 16000 },
  // Formula can be used for higher levels: Base * (Level^1.5) or similar
];

export const getLevelForXP = (totalXP: number): number => {
  let currentLevel = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalXP >= threshold.xpRequired) {
      currentLevel = threshold.level;
    } else {
      break;
    }
  }
  
  // If XP exceeds max defined level, calculate dynamically (simple scale for now)
  const maxDefinedLevel = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  if (totalXP >= maxDefinedLevel.xpRequired) {
    const excessXP = totalXP - maxDefinedLevel.xpRequired;
    const additionalLevels = Math.floor(excessXP / 5000); // 5000 XP per level past 10
    return maxDefinedLevel.level + additionalLevels;
  }
  
  return currentLevel;
};

export const getXPRequiredForNextLevel = (currentLevel: number): number => {
  const nextLevelThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1);
  if (nextLevelThreshold) {
    return nextLevelThreshold.xpRequired;
  }
  // For dynamically calculated levels above 10
  const maxDefinedLevel = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const additionalLevels = currentLevel - maxDefinedLevel.level;
  return maxDefinedLevel.xpRequired + (additionalLevels + 1) * 5000;
};
