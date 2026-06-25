import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '../../animations/variants';
import { StatusBadge } from './StatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { HabitActionsDropdown } from './HabitActionsDropdown';
import { useHabitStore } from '../../store/habitStore';
import type { Habit } from '../../types/habit.types';

interface HabitListProps {
  habits: Habit[];
}

export const HabitList = ({ habits }: HabitListProps) => {
  const { openEditModal } = useHabitStore();

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
      role="list"
      aria-label="Habits"
    >
      {habits.map((habit) => (
        <motion.div
          key={habit.id}
          variants={staggerItemVariants}
          whileHover={{ x: 4, transition: { duration: 0.2 } }}
          className="glass-card rounded-xl p-4 flex items-center gap-4"
          role="listitem"
        >
          <span className="text-xl flex-shrink-0" aria-hidden="true">{habit.icon}</span>

          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => openEditModal(habit.id)}
              className="text-sm font-medium text-foreground hover:underline text-left truncate block
                         focus-visible:outline-none focus-visible:underline"
            >
              {habit.title}
            </button>
            <p className="text-xs text-muted-foreground mt-0.5">{habit.category} · {habit.estimatedDuration}m</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-muted-foreground hidden sm:block">
              🔥 {habit.statistics.currentStreak}d
            </span>
            <PriorityIndicator priority={habit.priority} />
            <StatusBadge status={habit.status} />
            <HabitActionsDropdown habit={habit} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
