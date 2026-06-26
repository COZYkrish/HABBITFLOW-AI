import { apiClient } from './axios';
import type { AnyReportDTO, WeeklyReportDTO, MonthlyReportDTO, YearlyReportDTO } from '../../../server/src/modules/reports/reports.types';

export const fetchWeeklyReport = async (): Promise<WeeklyReportDTO> => {
  const response = await apiClient.get('/reports/weekly');
  return response.data.data;
};

export const fetchMonthlyReport = async (): Promise<MonthlyReportDTO> => {
  const response = await apiClient.get('/reports/monthly');
  return response.data.data;
};

export const fetchYearlyReport = async (): Promise<YearlyReportDTO> => {
  const response = await apiClient.get('/reports/yearly');
  return response.data.data;
};

export const exportPdf = async (type: 'weekly' | 'monthly' | 'yearly'): Promise<Blob> => {
  const response = await apiClient.post('/reports/export/pdf', { type }, { responseType: 'blob' });
  return response.data;
};

export const exportCsv = async (type: 'weekly' | 'monthly' | 'yearly'): Promise<Blob> => {
  const response = await apiClient.post('/reports/export/csv', { type }, { responseType: 'blob' });
  return response.data;
};

export const exportJson = async (type: 'weekly' | 'monthly' | 'yearly'): Promise<Blob> => {
  const response = await apiClient.post('/reports/export/json', { type }, { responseType: 'blob' });
  return response.data;
};
