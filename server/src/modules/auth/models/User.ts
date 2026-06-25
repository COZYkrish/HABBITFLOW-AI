import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  emailVerified: boolean;
  verificationTokenHash?: string;
  passwordResetTokenHash?: string;
  passwordResetExpiry?: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
  };
  statistics: {
    totalHabits: number;
    longestStreak: number;
    currentStreak: number;
  };
  lastLogin?: Date;
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
    emailVerified: { type: Boolean, default: false },
    verificationTokenHash: { type: String },
    passwordResetTokenHash: { type: String },
    passwordResetExpiry: { type: Date },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notificationsEnabled: { type: Boolean, default: true },
    },
    statistics: {
      totalHabits: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
    },
    lastLogin: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
