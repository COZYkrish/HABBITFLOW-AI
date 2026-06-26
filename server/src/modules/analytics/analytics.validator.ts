import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  timezone: z.string().optional().default('UTC'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
  categoryId: z.string().optional(),
  habitId: z.string().optional(),
  year: z.string().regex(/^\d{4}$/, 'Must be YYYY').optional(),
  month: z.string().regex(/^(1[0-2]|[1-9])$/, 'Must be 1-12').optional(),
});

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
