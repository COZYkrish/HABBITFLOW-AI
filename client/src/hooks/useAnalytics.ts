import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';
import type { AnalyticsFilters } from '../types/analytics.types';

export const useAnalyticsOverview = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'overview', filters],
    queryFn: () => analyticsApi.getOverview(filters),
  });
};

export const useHeatmap = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'heatmap', filters],
    queryFn: () => analyticsApi.getHeatmap(filters),
  });
};

export const useWeeklyAnalytics = (filters: AnalyticsFilters) => {
  return useQuery({
    queryKey: ['analytics', 'weekly', filters],
    queryFn: () => analyticsApi.getWeekly(filters),
    enabled: !!filters.startDate && !!filters.endDate,
  });
};

export const useMonthlyAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'monthly', filters],
    queryFn: () => analyticsApi.getMonthly(filters),
  });
};

export const useYearlyAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'yearly', filters],
    queryFn: () => analyticsApi.getYearly(filters),
  });
};

export const useCategoryAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'categories', filters],
    queryFn: () => analyticsApi.getCategories(filters),
  });
};

export const useProductivity = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'productivity', filters],
    queryFn: () => analyticsApi.getProductivity(filters),
  });
};

export const useStreaks = () => {
  return useQuery({
    queryKey: ['analytics', 'streaks'],
    queryFn: () => analyticsApi.getStreaks(),
  });
};
