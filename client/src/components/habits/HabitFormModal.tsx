import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitForm } from './HabitForm';
import { useCreateHabit, useUpdateHabit, useHabit } from '../../hooks/useHabits';
import { useHabitStore } from '../../store/habitStore';
import type { CreateHabitData } from '../../types/habit.types';

interface HabitFormModalProps {
  mode: 'create' | 'edit';
}

/**
 * HabitFormModal — lazy-loadable modal wrapping HabitForm.
 * Handles both create and edit modes.
 * Traps focus; closes on backdrop click or Escape.
 */
export const HabitFormModal = ({ mode }: HabitFormModalProps) => {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    selectedHabitId,
    closeCreateModal,
    closeEditModal,
  } = useHabitStore();

  const isOpen = mode === 'create' ? isCreateModalOpen : isEditModalOpen;
  const close = mode === 'create' ? closeCreateModal : closeEditModal;

  const { data: habitToEdit } = useHabit(
    mode === 'edit' && selectedHabitId ? selectedHabitId : ''
  );

  const { mutate: createHabit, isPending: isCreating } = useCreateHabit();
  const { mutate: updateHabit, isPending: isUpdating } = useUpdateHabit();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, close]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = (data: CreateHabitData) => {
    if (mode === 'create') {
      createHabit(data, { onSuccess: close });
    } else if (selectedHabitId) {
      updateHabit({ id: selectedHabitId, data }, { onSuccess: close });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={mode === 'create' ? 'Create habit' : 'Edit habit'}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass border-l border-border/60
                       overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 glass border-b border-border/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-medium">
                {mode === 'create' ? 'New Habit' : 'Edit Habit'}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground
                           hover:text-foreground hover:bg-foreground/[0.06] transition-colors
                           focus-visible:outline-none focus-visible:ring-2"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              {(mode === 'create' || habitToEdit) && (
                <HabitForm
                  defaultValues={mode === 'edit' ? habitToEdit : undefined}
                  onSubmit={handleSubmit}
                  isLoading={isCreating || isUpdating}
                  submitLabel={mode === 'create' ? 'Create Habit' : 'Update Habit'}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
