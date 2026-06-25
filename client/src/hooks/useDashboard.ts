import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '../api/dashboard.service';
import type { DashboardSummary } from '../types/dashboard.types';

/** Query key factory — makes invalidation explicit and typo-proof */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
};

/**
 * useDashboard — TanStack Query hook for dashboard summary data.
 * Caches for 5 minutes; refetches on window focus.
 */
export const useDashboard = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: dashboardKeys.summary(),
    queryFn: fetchDashboardSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
