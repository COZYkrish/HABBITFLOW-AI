import { Response, NextFunction } from 'express';
import { gamificationService } from './gamification.service';
import type { AuthRequest } from '../../middleware/auth.middleware';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });

    const profile = await gamificationService.getProfile(userId);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });

    const achievements = await gamificationService.getAchievements(userId);
    res.status(200).json({ success: true, data: achievements });
  } catch (error) {
    next(error);
  }
};
export const getChallenges = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });

    const challenges = await gamificationService.getChallenges(userId);
    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    next(error);
  }
};

// export const getDailyGoal = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });

//     const goal = await gamificationService.getDailyGoal(userId);
//     res.status(200).json({ success: true, data: goal });
//   } catch (error) {
//     next(error);
//   }
// };

export const recalculateXP = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });

    // This would ideally do a full replay of history, but for now we just return a success
    // Or we trigger a manual dummy event
    const result = await gamificationService.dispatchXPEvent({
      userId,
      action: 'MANUAL_RECALCULATION',
      xpAmount: 0
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
