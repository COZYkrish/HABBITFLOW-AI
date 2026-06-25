import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { HabitApiService } from '../api/habit.service';
import type {
  Habit,
  CreateHabitData,
  UpdateHabitData,
  LogHabitData,
  ListHabitsParams,
  PaginatedHabits,
} from '../types/habit.types';
import toast from 'react-hot-toast';

// ── Query key factory ──────────────────────────────────────────────────────
export const habitKeys = {
  all: ['habits'] as const,
  lists: () => [...habitKeys.all, 'list'] as const,
  list: (params: ListHabitsParams) => [...habitKeys.lists(), params] as const,
  detail: (id: string) => [...habitKeys.all, 'detail', id] as const,
  logs: (id: string) => [...habitKeys.all, 'logs', id] as const,
};

// ── Queries ────────────────────────────────────────────────────────────────

/** Fetch paginated habit list with optional filters */
export const useHabits = (params: ListHabitsParams = {}) =>
  useQuery<PaginatedHabits, Error>({
    queryKey: habitKeys.list(params),
    queryFn: () => HabitApiService.list(params),
    staleTime: 2 * 60 * 1000,
  });

/** Fetch a single habit */
export const useHabit = (id: string) =>
  useQuery<Habit, Error>({
    queryKey: habitKeys.detail(id),
    queryFn: () => HabitApiService.getById(id),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });

/** Fetch habit logs */
export const useHabitLogs = (id: string, fromDate?: string, toDate?: string) =>
  useQuery({
    queryKey: habitKeys.logs(id),
    queryFn: () => HabitApiService.getLogs(id, fromDate, toDate),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

// ── Mutations ──────────────────────────────────────────────────────────────

/** Create a new habit — optimistically adds to list */
export const useCreateHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHabitData) => HabitApiService.create(data),
    onSuccess: (newHabit) => {
      qc.invalidateQueries({ queryKey: habitKeys.lists() });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`"${newHabit.title}" created`);
    },
    onError: () => toast.error('Failed to create habit'),
  });
};

/** Update a habit — optimistic update */
export const useUpdateHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHabitData }) =>
      HabitApiService.update(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: habitKeys.detail(id) });
      const prev = qc.getQueryData<Habit>(habitKeys.detail(id));
      if (prev) qc.setQueryData(habitKeys.detail(id), { ...prev, ...data });
      return { prev };
    },
    onError: (_e, { id }, ctx) => {
      if (ctx?.prev) qc.setQueryData(habitKeys.detail(id), ctx.prev);
      toast.error('Failed to update habit');
    },
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: habitKeys.detail(id) });
      qc.invalidateQueries({ queryKey: habitKeys.lists() });
    },
    onSuccess: () => toast.success('Habit updated'),
  });
};

/** Soft delete — optimistically remove from list */
export const useDeleteHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HabitApiService.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: habitKeys.lists() });
      const prevLists = qc.getQueriesData<PaginatedHabits>({ queryKey: habitKeys.lists() });
      qc.setQueriesData<PaginatedHabits>({ queryKey: habitKeys.lists() }, (old) =>
        old ? { ...old, habits: old.habits.filter((h) => h.id !== id), total: old.total - 1 } : old
      );
      return { prevLists };
    },
    onError: (_e, _id, ctx) => {
      ctx?.prevLists.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error('Failed to delete habit');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: habitKeys.lists() });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onSuccess: () => toast.success('Habit deleted'),
  });
};

/** Toggle archive — optimistic status update */
export const useArchiveHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HabitApiService.archive(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: habitKeys.detail(id) });
      const prev = qc.getQueryData<Habit>(habitKeys.detail(id));
      if (prev) {
        qc.setQueryData(habitKeys.detail(id), {
          ...prev,
          isArchived: !prev.isArchived,
          status: prev.isArchived ? 'active' : 'archived',
        });
      }
      return { prev };
    },
    onError: (_e, id, ctx) => {
      if (ctx?.prev) qc.setQueryData(habitKeys.detail(id), ctx.prev);
      toast.error('Failed to update archive status');
    },
    onSettled: (_d, _e, id) => {
      qc.invalidateQueries({ queryKey: habitKeys.detail(id) });
      qc.invalidateQueries({ queryKey: habitKeys.lists() });
    },
    onSuccess: (h) => toast.success(h.isArchived ? 'Habit archived' : 'Habit restored'),
  });
};

/** Pause habit */
export const usePauseHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HabitApiService.pause(id),
    onSuccess: (h) => {
      qc.invalidateQueries({ queryKey: habitKeys.lists() });
      qc.invalidateQueries({ queryKey: habitKeys.detail(h.id) });
      toast.success('Habit paused');
    },
    onError: () => toast.error('Failed to pause habit'),
  });
};

/** Resume habit */
export const useResumeHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HabitApiService.resume(id),
    onSuccess: (h) => {
      qc.invalidateQueries({ queryKey: habitKeys.lists() });
      qc.invalidateQueries({ queryKey: habitKeys.detail(h.id) });
      toast.success('Habit resumed');
    },
    onError: () => toast.error('Failed to resume habit'),
  });
};

/** Duplicate habit */
export const useDuplicateHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HabitApiService.duplicate(id),
    onSuccess: (h) => {
      qc.invalidateQueries({ queryKey: habitKeys.lists() });
      toast.success(`"${h.title}" duplicated`);
    },
    onError: () => toast.error('Failed to duplicate habit'),
  });
};

/** Log habit completion — optimistic update on dashboard today habits */
export const useLogHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LogHabitData }) =>
      HabitApiService.log(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: habitKeys.lists() });
    },
    onError: () => toast.error('Failed to log habit'),
  });
};
