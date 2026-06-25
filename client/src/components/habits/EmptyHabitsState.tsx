import { motion } from 'framer-motion';
import { fadeUpVariants } from '../../animations/variants';
import { Button } from '../ui/Button';
import { useHabitStore } from '../../store/habitStore';

/** Beautiful empty state shown when a user has no habits yet. */
export const EmptyHabitsState = () => {
  const { openCreateModal } = useHabitStore();

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 text-center px-6"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-20 h-20 rounded-3xl glass-card flex items-center justify-center mb-6"
      >
        <span className="text-4xl" aria-hidden="true">✦</span>
      </motion.div>

      <h2 className="text-xl font-thin mb-2">No habits yet</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
        Every great journey starts with one small habit.
        Create your first one and start building momentum.
      </p>

      <Button onClick={openCreateModal} className="h-10 px-6 rounded-xl">
        Create First Habit
      </Button>
    </motion.div>
  );
};
