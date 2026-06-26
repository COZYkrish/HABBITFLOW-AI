import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '../../animations/variants';
import { useLogHabit } from '../../hooks/useHabits';
import type { TodayHabit } from '../../types/dashboard.types';

interface TodayHabitsProps {
  habits: TodayHabit[];
}

const PRIORITY_STYLES: Record<TodayHabit['priority'], string> = {
  high: 'bg-foreground/10 text-foreground',
  medium: 'bg-foreground/6 text-muted-foreground',
  low: 'bg-foreground/4 text-muted-foreground/70',
};

const STATUS_LABEL: Record<TodayHabit['status'], string> = {
  pending: 'Pending',
  completed: 'Done',
  skipped: 'Skipped',
};

const EmptyHabits = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center mb-4">
      <span className="text-2xl" aria-hidden="true">✦</span>
    </div>
    <p className="text-sm font-medium text-foreground">No habits scheduled today</p>
    <p className="text-xs text-muted-foreground mt-1">
      Create your first habit to get started
    </p>
  </div>
);

/**
 * TodayHabits — real-time habit list from dashboard API.
 * Completion checkbox calls useLogHabit for instant feedback.
 */
export const TodayHabits = ({ habits }: TodayHabitsProps) => {
  const { mutate: logHabit, isPending } = useLogHabit();

  const handleToggle = (habit: TodayHabit) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    logHabit({
      id: habit.id,
      data: { date: today, completed: habit.status !== 'completed' },
    });
  };

  if (habits.length === 0) return <EmptyHabits />;

  return (
    <motion.ul
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2 h-full overflow-y-auto no-scrollbar"
      role="list"
      aria-label="Today's habits"
    >
      {habits.map((habit) => (
        <motion.li
          key={habit.id}
          variants={staggerItemVariants}
          whileHover={{ x: 4, transition: { duration: 0.2 } }}
          className="glass-card rounded-xl p-3 flex items-center gap-2 md:gap-3 cursor-default"
        >
          {/* Completion checkbox — wired to API */}
          <button
            type="button"
            aria-label={`Mark ${habit.name} as ${habit.status === 'completed' ? 'incomplete' : 'complete'}`}
            aria-pressed={habit.status === 'completed'}
            disabled={isPending}
            onClick={() => handleToggle(habit)}
            className="w-5 h-5 rounded-full border border-border flex-shrink-0 flex items-center justify-center
                       hover:border-foreground/50 transition-colors focus-visible:outline-none focus-visible:ring-2
                       disabled:opacity-40"
          >
            {habit.status === 'completed' && (
              <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
            )}
          </button>

          {/* Icon */}
          <span className="text-lg md:text-xl flex-shrink-0" aria-hidden="true">{habit.icon}</span>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              habit.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {habit.name}
            </p>
            <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 truncate">
              {habit.category} · {habit.estimatedMinutes}m
            </p>
          </div>

          {/* Priority badge */}
          <span
            className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider shrink-0 ${
              PRIORITY_STYLES[habit.priority]
            }`}
          >
            {habit.priority}
          </span>

          {/* Status */}
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {STATUS_LABEL[habit.status]}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
};
