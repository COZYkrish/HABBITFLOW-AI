import { Request, Response, NextFunction } from 'express';
import { ProfileService } from './profile.service';

export class ProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await ProfileService.getProfile(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await ProfileService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  static async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await ProfileService.updatePreferences(userId, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  static async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      // req.file is provided by multer middleware
      if (!req.file) {
        throw Object.assign(new Error('No file uploaded'), { statusCode: 400 });
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const metadata = {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };

      const data = await ProfileService.updateAvatar(userId, avatarUrl, metadata);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  static async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await ProfileService.deleteAvatar(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await ProfileService.changePassword(userId, req.body);
      res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  static async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await ProfileService.deleteAccount(userId);
      res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  static async getActiveSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await ProfileService.getActiveSessions(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }

  static async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const sessionId = req.params.id as string;
      await ProfileService.revokeSession(userId, sessionId);
      res.status(200).json({ success: true, message: 'Session revoked successfully' });
    } catch (error: any) {
      next({ message: error.message, statusCode: error.statusCode || 500 });
    }
  }
}
