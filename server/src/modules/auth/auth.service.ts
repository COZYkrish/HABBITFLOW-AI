import bcrypt from 'bcrypt';
import { User } from './models/User';
import { Session } from './models/Session';
import { generateAccessToken, generateRefreshToken, generateRandomToken, hashToken } from '../../utils/token';
import { sendEmail } from '../../utils/email';
import { env } from '../../config/env';

export class AuthService {
  static async register(data: any) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const verificationToken = generateRandomToken();
    const verificationTokenHash = hashToken(verificationToken);

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      verificationTokenHash,
    });

    const verifyUrl = `${env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your email address - HabitFlow AI',
      html: `
        <h1>Welcome to HabitFlow AI!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>Or copy and paste this link: ${verifyUrl}</p>
      `,
    });

    return {
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  static async verifyEmail(token: string) {
    const tokenHash = hashToken(token);
    const user = await User.findOne({ verificationTokenHash: tokenHash });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.verificationTokenHash = undefined;
    await user.save();

    return { success: true, message: 'Email verified successfully' };
  }

  static async login(data: any, clientInfo: any) {
    const user = await User.findOne({ email: data.email.toLowerCase() });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new Error('Please verify your email address before logging in');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = hashToken(refreshToken);

    // Calculate expiry (e.g. 7d)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await Session.create({
      user: user.id,
      refreshTokenHash,
      device: clientInfo.device,
      browser: clientInfo.browser,
      os: clientInfo.os,
      ip: clientInfo.ip,
      expiresAt,
    });

    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        statistics: user.statistics,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async logout(refreshToken: string) {
    if (!refreshToken) return;
    const tokenHash = hashToken(refreshToken);
    await Session.updateMany(
      { refreshTokenHash: tokenHash },
      { $set: { revoked: true } }
    );
  }

  static async refresh(refreshToken: string, clientInfo: any) {
    if (!refreshToken) {
      throw new Error('No refresh token provided');
    }

    const tokenHash = hashToken(refreshToken);
    const session = await Session.findOne({ refreshTokenHash: tokenHash, revoked: false });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        session.revoked = true;
        await session.save();
      }
      throw new Error('Invalid or expired refresh token');
    }

    const user = await User.findById(session.user);
    if (!user || user.status !== 'active') {
      throw new Error('User account is not active');
    }

    // Rotate refresh token
    session.revoked = true;
    await session.save();

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);
    const newRefreshTokenHash = hashToken(newRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await Session.create({
      user: user.id,
      refreshTokenHash: newRefreshTokenHash,
      device: clientInfo.device,
      browser: clientInfo.browser,
      os: clientInfo.os,
      ip: clientInfo.ip,
      expiresAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { success: true, message: 'If that email exists, a reset link has been sent.' }; // Generic message for security
    }

    const resetToken = generateRandomToken();
    user.passwordResetTokenHash = hashToken(resetToken);
    
    // 1 hour expiry
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    user.passwordResetExpiry = expiry;
    
    await user.save();

    const resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset - HabitFlow AI',
      html: `
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return { success: true, message: 'If that email exists, a reset link has been sent.' };
  }

  static async resetPassword(data: any) {
    const tokenHash = hashToken(data.token);
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.passwordHash = await bcrypt.hash(data.password, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    // Revoke all sessions
    await Session.updateMany(
      { user: user.id, revoked: false },
      { $set: { revoked: true } }
    );

    return { success: true, message: 'Password reset successful. Please login with your new password.' };
  }
}
