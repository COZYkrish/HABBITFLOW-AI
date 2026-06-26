import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../api/insights.api';

export const useInsightsOverview = () => {
  return useQuery({
    queryKey: ['insights', 'overview'],
    queryFn: () => insightsApi.getOverview(),
  });
};
