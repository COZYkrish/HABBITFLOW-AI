import { motion } from 'framer-motion';
import { cardHoverVariants } from '../../animations/variants';
import { StatusBadge } from './StatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { HabitActionsDropdown } from './HabitActionsDropdown';
import { useHabitStore } from '../../store/habitStore';
import type { Habit } from '../../types/habit.types';

interface HabitCardProps {
  habit: Habit;
}

const REPEAT_LABEL: Record<string, string> = {
  daily: 'Daily',
  weekdays: 'Weekdays',
  weekends: 'Weekends',
  weekly: 'Weekly',
  monthly: 'Monthly',
  custom: 'Custom',
};

/**
 * HabitCard — premium card for grid and list views.
 * Shows icon, title, category, streak, status, and actions.
 */
export const HabitCard = ({ habit }: HabitCardProps) => {
  const { openEditModal } = useHabitStore();

  return (
    <motion.article
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className="glass-card rounded-2xl p-5 flex flex-col gap-4 cursor-default
                 transition-colors hover:bg-foreground/[0.02] relative group
                 hover:z-50 focus-within:z-50 overflow-hidden"
      aria-label={habit.title}
    >
      {/* Color accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80" 
        style={{ backgroundColor: habit.color || 'var(--foreground)' }} 
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 pl-1">
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon */}
          <div 
            className="w-10 h-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0"
            style={{ 
              backgroundColor: habit.color ? `${habit.color}15` : undefined,
              boxShadow: habit.color ? `inset 0 0 0 1px ${habit.color}30` : undefined
            }}
          >
            <span className="text-lg" aria-hidden="true">{habit.icon}</span>
          </div>

          {/* Title + category */}
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => openEditModal(habit.id)}
              className="text-sm font-medium text-left text-foreground hover:underline truncate block max-w-[160px]
                         focus-visible:outline-none focus-visible:underline"
            >
              {habit.title}
            </button>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{habit.category}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <HabitActionsDropdown habit={habit} />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {/* Streak */}
        <span className="flex items-center gap-1" title="Current streak">
          <span aria-hidden="true">🔥</span>
          {habit.statistics.currentStreak}d
        </span>

        {/* Repeat */}
        <span className="flex items-center gap-1" title="Repeat schedule">
          <span aria-hidden="true">↻</span>
          {REPEAT_LABEL[habit.repeatSchedule?.type] ?? 'Daily'}
        </span>

        {/* Duration */}
        <span title="Estimated duration">{habit.estimatedDuration}m</span>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <StatusBadge status={habit.status} />
        <PriorityIndicator priority={habit.priority} />
      </div>

      {/* Paused overlay */}
      {habit.isPaused && (
        <div className="absolute inset-0 rounded-2xl bg-background/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Paused</span>
        </div>
      )}
    </motion.article>
  );
};
