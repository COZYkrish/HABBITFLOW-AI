import { IUserXP } from '../models/UserXP';
import { getLevelForXP, getXPRequiredForNextLevel } from '../constants/level.constants';

export const processLevelUp = async (userXP: IUserXP): Promise<{ leveledUp: boolean; newLevel: number }> => {
  const calculatedLevel = getLevelForXP(userXP.currentXP);
  
  if (calculatedLevel > userXP.currentLevel) {
    userXP.currentLevel = calculatedLevel;
    userXP.xpRequiredForNextLevel = getXPRequiredForNextLevel(calculatedLevel);
    userXP.lastLevelUp = new Date();
    await userXP.save();
    return { leveledUp: true, newLevel: calculatedLevel };
  }

  // Update xpRequiredForNextLevel just in case it's out of sync
  const requiredXP = getXPRequiredForNextLevel(userXP.currentLevel);
  if (userXP.xpRequiredForNextLevel !== requiredXP) {
    userXP.xpRequiredForNextLevel = requiredXP;
    await userXP.save();
  }

  return { leveledUp: false, newLevel: userXP.currentLevel };
};
