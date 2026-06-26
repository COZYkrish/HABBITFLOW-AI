import api from './axios';
import { 
  AnalyticsFilters, 
  AnalyticsOverviewDTO, 
  HeatmapDTO, 
  WeeklyAnalyticsDTO, 
  MonthlyAnalyticsDTO, 
  YearlyAnalyticsDTO, 
  CategoryAnalyticsDTO, 
  ProductivityDTO, 
  StreakDTO 
} from '../types/analytics.types';

export const analyticsApi = {
  getOverview: async (filters: AnalyticsFilters = {}) => {
    const { data } = await api.get<{ success: boolean; data: AnalyticsOverviewDTO }>('/analytics/overview', { params: filters });
    return data.data;
  },
  
  getHeatmap: async (filters: AnalyticsFilters = {}) => {
    const { data } = await api.get<{ success: boolean; data: HeatmapDTO }>('/analytics/heatmap', { params: filters });
    return data.data;
  },

  getWeekly: async (filters: AnalyticsFilters = {}) => {
    const { data } = await api.get<{ success: boolean; data: WeeklyAnalyticsDTO }>('/analytics/weekly', { params: filters });
    return data.data;
  },

  getMonthly: async (filters: AnalyticsFilters = {}) => {
    const { data } = await api.get<{ success: boolean; data: MonthlyAnalyticsDTO }>('/analytics/monthly', { params: filters });
    return data.data;
  },

  getYearly: async (filters: AnalyticsFilters = {}) => {
    const { data } = await api.get<{ success: boolean; data: YearlyAnalyticsDTO }>('/analytics/yearly', { params: filters });
    return data.data;
  },

  getCategories: async (filters: AnalyticsFilters = {}) => {
    const { data } = await api.get<{ success: boolean; data: CategoryAnalyticsDTO }>('/analytics/categories', { params: filters });
    return data.data;
  },

  getProductivity: async (filters: AnalyticsFilters = {}) => {
    const { data } = await api.get<{ success: boolean; data: ProductivityDTO }>('/analytics/productivity', { params: filters });
    return data.data;
  },

  getStreaks: async () => {
    const { data } = await api.get<{ success: boolean; data: StreakDTO }>('/analytics/streaks');
    return data.data;
  }
};
