import { useQuery } from '@tanstack/react-query';
import { HabitApiService } from '../api/habit.service';
import type { Category } from '../types/habit.types';

export const categoriesKeys = {
  all: ['categories'] as const,
};

/** Fetches all system + user categories. Cached for 10 minutes. */
export const useCategories = () =>
  useQuery<Category[], Error>({
    queryKey: categoriesKeys.all,
    queryFn: HabitApiService.getCategories,
    staleTime: 10 * 60 * 1000,
  });
