import { Types } from 'mongoose';
import { XPEventData } from '../types/gamification.types';
import { UserXPModel, IUserXP } from '../models/UserXP';

export const processXPEvent = async (event: XPEventData): Promise<{ userXP: IUserXP; xpGained: number }> => {
  const userId = new Types.ObjectId(event.userId);
  const xpAmount = event.xpAmount;

  if (xpAmount <= 0) {
    let userXP = await UserXPModel.findOne({ userId });
    if (!userXP) {
      userXP = await UserXPModel.create({ userId });
    }
    return { userXP, xpGained: 0 };
  }

  // Find or create UserXP
  let userXP = await UserXPModel.findOne({ userId });
  if (!userXP) {
    userXP = new UserXPModel({ userId });
  }

  const now = new Date();

  // Reset daily/weekly/monthly stats if needed (basic implementation, in prod you'd use crons or date diffs)
  // For now, we'll just increment them, and assume a separate cron resets them, 
  // or we can check the date of lastXPEvent and reset if it's a new day/week/month.
  if (userXP.lastXPEvent) {
    const lastDate = userXP.lastXPEvent.toDateString();
    const todayDate = now.toDateString();
    if (lastDate !== todayDate) {
      userXP.xpEarnedToday = 0;
    }
    // Simplification for week/month for now
  }

  userXP.currentXP += xpAmount;
  userXP.lifetimeXP += xpAmount;
  userXP.xpEarnedToday += xpAmount;
  userXP.xpEarnedThisWeek += xpAmount;
  userXP.xpEarnedThisMonth += xpAmount;
  userXP.lastXPEvent = now;

  await userXP.save();

  return { userXP, xpGained: xpAmount };
};
