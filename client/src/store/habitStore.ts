import { create } from 'zustand';
import type { ListHabitsParams } from '../types/habit.types';

type ViewMode = 'grid' | 'list';

interface HabitUIState {
  viewMode: ViewMode;
  filters: ListHabitsParams;
  selectedHabitId: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  isArchiveDialogOpen: boolean;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setFilter: (key: keyof ListHabitsParams, value: string | boolean | number | undefined) => void;
  clearFilters: () => void;
  setSelectedHabit: (id: string | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (id: string) => void;
  closeEditModal: () => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  openArchiveDialog: (id: string) => void;
  closeArchiveDialog: () => void;
}

const DEFAULT_FILTERS: ListHabitsParams = {
  search: '',
  sortBy: 'createdAt',
  order: 'desc',
  page: 1,
  limit: 20,
};

/**
 * habitStore — pure UI state for the habit management module.
 * Server state lives in TanStack Query; this store only holds selections, modals, filters.
 */
export const useHabitStore = create<HabitUIState>((set) => ({
  viewMode: 'grid',
  filters: DEFAULT_FILTERS,
  selectedHabitId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteDialogOpen: false,
  isArchiveDialogOpen: false,

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 },
    })),

  clearFilters: () => set({ filters: DEFAULT_FILTERS }),

  setSelectedHabit: (id) => set({ selectedHabitId: id }),

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  openEditModal: (id) => set({ isEditModalOpen: true, selectedHabitId: id }),
  closeEditModal: () => set({ isEditModalOpen: false, selectedHabitId: null }),

  openDeleteDialog: (id) => set({ isDeleteDialogOpen: true, selectedHabitId: id }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selectedHabitId: null }),

  openArchiveDialog: (id) => set({ isArchiveDialogOpen: true, selectedHabitId: id }),
  closeArchiveDialog: () => set({ isArchiveDialogOpen: false, selectedHabitId: null }),
}));
