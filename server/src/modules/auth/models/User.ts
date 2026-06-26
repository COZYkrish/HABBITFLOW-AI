import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  avatarMetadata?: {
    originalName: string;
    size: number;
    mimetype: string;
  };
  bio?: string;
  timezone: string;
  weekStart: 'Sunday' | 'Monday';
  emailVerified: boolean;
  verificationTokenHash?: string;
  passwordResetTokenHash?: string;
  passwordResetExpiry?: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    language: string;
    dashboardLayout: string;
    reducedMotion: boolean;
    compactMode: boolean;
  };
  statistics: {
    totalHabits: number;
    longestStreak: number;
    currentStreak: number;
    lastCompletedAt?: Date;
    achievementsCount: number;
  };
  lastLogin?: Date;
  lastActive?: Date;
  profileCompletion: number;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    avatarMetadata: {
      originalName: { type: String },
      size: { type: Number },
      mimetype: { type: String },
    },
    bio: { type: String, maxLength: 500 },
    timezone: { type: String, default: 'UTC' },
    weekStart: { type: String, enum: ['Sunday', 'Monday'], default: 'Monday' },
    emailVerified: { type: Boolean, default: false },
    verificationTokenHash: { type: String },
    passwordResetTokenHash: { type: String },
    passwordResetExpiry: { type: Date },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notificationsEnabled: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
      dashboardLayout: { type: String, default: 'default' },
      reducedMotion: { type: Boolean, default: false },
      compactMode: { type: Boolean, default: false },
    },
    statistics: {
      totalHabits: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      lastCompletedAt: { type: Date },
      achievementsCount: { type: Number, default: 0 },
    },
    lastLogin: { type: Date },
    lastActive: { type: Date },
    profileCompletion: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
