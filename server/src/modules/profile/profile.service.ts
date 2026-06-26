import { User } from '../auth/models/User';
import { UpdateProfileDTO, UpdatePreferencesDTO, ChangePasswordDTO, ProfileResponse } from './profile.types';
import bcrypt from 'bcrypt';
import { Session } from '../auth/models/Session';

export class ProfileService {
  static async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await User.findById(userId).lean();
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      timezone: user.timezone,
      weekStart: user.weekStart,
      preferences: user.preferences,
      statistics: user.statistics,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
    };
  }

  static async updateProfile(userId: string, data: UpdateProfileDTO): Promise<ProfileResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    ).lean();
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    return this.getProfile(userId);
  }

  static async updatePreferences(userId: string, data: UpdatePreferencesDTO): Promise<ProfileResponse> {
    const updateObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      updateObj[`preferences.${key}`] = value;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateObj },
      { new: true }
    ).lean();
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    return this.getProfile(userId);
  }

  static async updateAvatar(userId: string, avatarUrl: string, metadata?: any): Promise<ProfileResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          avatar: avatarUrl,
          avatarMetadata: metadata
        } 
      },
      { new: true }
    ).lean();
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    return this.getProfile(userId);
  }

  static async deleteAvatar(userId: string): Promise<ProfileResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $unset: { 
          avatar: '',
          avatarMetadata: ''
        } 
      },
      { new: true }
    ).lean();
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    return this.getProfile(userId);
  }

  static async changePassword(userId: string, data: ChangePasswordDTO): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    if (data.currentPassword) {
      const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
      if (!isValid) throw Object.assign(new Error('Invalid current password'), { statusCode: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.newPassword, salt);

    user.passwordHash = passwordHash;
    await user.save();
  }

  static async deleteAccount(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    
    // In a real app we might soft-delete or clear associated data
    user.status = 'deleted';
    await user.save();
  }

  static async getActiveSessions(userId: string) {
    return Session.find({ user: userId, revoked: false }).sort({ lastActivity: -1 }).select('-refreshTokenHash');
  }

  static async revokeSession(userId: string, sessionId: string) {
    const session = await Session.findOne({ _id: sessionId, user: userId });
    if (!session) throw Object.assign(new Error('Session not found'), { statusCode: 404 });

    session.revoked = true;
    await session.save();
  }
}
