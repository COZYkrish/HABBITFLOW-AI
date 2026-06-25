import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useDeleteHabit } from '../../hooks/useHabits';
import { useHabitStore } from '../../store/habitStore';

export const DeleteDialog = () => {
  const { isDeleteDialogOpen, selectedHabitId, closeDeleteDialog } = useHabitStore();
  const { mutate: deleteHabit, isPending } = useDeleteHabit();

  const handleConfirm = () => {
    if (!selectedHabitId) return;
    deleteHabit(selectedHabitId, { onSuccess: closeDeleteDialog });
  };

  return (
    <AnimatePresence>
      {isDeleteDialogOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDeleteDialog}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            key="dialog"
            role="alertdialog"
            aria-modal="true"
            aria-label="Delete habit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-full max-w-sm glass-card rounded-2xl p-6"
          >
            <h2 className="text-base font-medium mb-2">Delete Habit</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This habit will be soft-deleted and can be recovered from the database.
              Are you sure you want to continue?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={closeDeleteDialog} disabled={isPending}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 h-9 rounded-md bg-red-500/90 text-white text-sm font-medium
                           hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
