import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').trim().optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    timezone: z.string().optional(),
    weekStart: z.enum(['Sunday', 'Monday']).optional(),
  }),
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notificationsEnabled: z.boolean().optional(),
    language: z.string().optional(),
    dashboardLayout: z.string().optional(),
    reducedMotion: z.boolean().optional(),
    compactMode: z.boolean().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  }),
});
