import { useQuery } from '@tanstack/react-query';
import { fetchWeeklyReport, fetchMonthlyReport, fetchYearlyReport } from '../api/reports.service';
import type { WeeklyReportDTO, MonthlyReportDTO, YearlyReportDTO } from '../../../server/src/modules/reports/reports.types';

export const reportKeys = {
  all: ['reports'] as const,
  weekly: () => [...reportKeys.all, 'weekly'] as const,
  monthly: () => [...reportKeys.all, 'monthly'] as const,
  yearly: () => [...reportKeys.all, 'yearly'] as const,
};

export const useWeeklyReport = () => {
  return useQuery<WeeklyReportDTO, Error>({
    queryKey: reportKeys.weekly(),
    queryFn: fetchWeeklyReport,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMonthlyReport = () => {
  return useQuery<MonthlyReportDTO, Error>({
    queryKey: reportKeys.monthly(),
    queryFn: fetchMonthlyReport,
    staleTime: 5 * 60 * 1000,
  });
};

export const useYearlyReport = () => {
  return useQuery<YearlyReportDTO, Error>({
    queryKey: reportKeys.yearly(),
    queryFn: fetchYearlyReport,
    staleTime: 5 * 60 * 1000,
  });
};
