import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { isProd } from '../../config/env';

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd, // True in production
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
  });
};

const getClientInfo = (req: Request) => {
  return {
    ip: req.ip,
    device: req.headers['user-agent'] || 'unknown',
    browser: req.headers['sec-ch-ua'] || 'unknown',
    os: req.headers['sec-ch-ua-platform'] || 'unknown',
  };
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyEmail(token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const clientInfo = getClientInfo(req);
      const result = await AuthService.login(req.body, clientInfo);

      setRefreshCookie(res, result.refreshToken);

      res.status(200).json({
        success: true,
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      await AuthService.logout(refreshToken);
      clearRefreshCookie(res);
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const clientInfo = getClientInfo(req);

      const result = await AuthService.refresh(refreshToken, clientInfo);

      setRefreshCookie(res, result.refreshToken);

      res.status(200).json({
        success: true,
        accessToken: result.accessToken,
      });
    } catch (error) {
      clearRefreshCookie(res);
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
