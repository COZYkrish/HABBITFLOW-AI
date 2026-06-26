export const INSIGHT_CONFIDENCE = {
  VERY_HIGH: 95,
  HIGH: 85,
  MEDIUM: 65,
  LOW: 40,
  VERY_LOW: 20
} as const;

export const BURN_OUT_THRESHOLDS = {
  CRITICAL_MISS_RATE: 0.7, // 70% missed
  HIGH_MISS_RATE: 0.5,
  MODERATE_MISS_RATE: 0.3
} as const;

export const STREAK_RISK_THRESHOLDS = {
  HIGH_RISK_DAYS: 2, // Missed 2 days
  MEDIUM_RISK_DAYS: 1 // Missed 1 day
} as const;
