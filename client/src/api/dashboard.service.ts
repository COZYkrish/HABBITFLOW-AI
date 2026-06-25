import { apiClient } from './axios';
import type { DashboardSummary } from '../types/dashboard.types';

/**
 * Fetches the full dashboard summary for the authenticated user.
 * Credentials (HttpOnly cookie) are sent automatically via the axios instance.
 */
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await apiClient.get('/dashboard/summary');
  return response.data.data as DashboardSummary;
};
