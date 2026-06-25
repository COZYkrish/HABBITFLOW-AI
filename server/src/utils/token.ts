import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
