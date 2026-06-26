import { apiClient as api } from './axios';
import type { OverviewResponse } from '../types/insights.types';

export const insightsApi = {
  getOverview: async () => {
    const { data } = await api.get<{ success: boolean; data: OverviewResponse }>('/insights/overview');
    return data.data;
  }
};
