import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  refreshTokenHash: string;
  device?: string;
  browser?: string;
  os?: string;
  ip?: string;
  revoked: boolean;
  lastActivity: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refreshTokenHash: { type: String, required: true },
    device: { type: String },
    browser: { type: String },
    os: { type: String },
    ip: { type: String },
    revoked: { type: Boolean, default: false },
    lastActivity: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Optional: Index for automatic expiration if desired, but we handle it via JWT expiry usually.
// SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
