import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useArchiveHabit } from '../../hooks/useHabits';
import { useHabitStore } from '../../store/habitStore';

export const ArchiveDialog = () => {
  const { isArchiveDialogOpen, selectedHabitId, closeArchiveDialog } = useHabitStore();
  const { mutate: archive, isPending } = useArchiveHabit();

  const handleConfirm = () => {
    if (!selectedHabitId) return;
    archive(selectedHabitId, { onSuccess: closeArchiveDialog });
  };

  return (
    <AnimatePresence>
      {isArchiveDialogOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeArchiveDialog}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            key="dialog"
            role="alertdialog"
            aria-modal="true"
            aria-label="Archive habit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-full max-w-sm glass-card rounded-2xl p-6"
          >
            <h2 className="text-base font-medium mb-2">Archive Habit</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Archiving will move this habit out of your active list.
              You can restore it at any time by visiting archived habits.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={closeArchiveDialog} disabled={isPending}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirm} disabled={isPending}>
                {isPending ? 'Archiving...' : 'Archive'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
