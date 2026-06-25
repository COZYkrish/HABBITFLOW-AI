import { motion } from 'framer-motion';
import { scaleInVariants } from '../../animations/variants';
import type { WeeklySummary } from '../../types/dashboard.types';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * WeeklySummaryCard — week-at-a-glance with mini bar chart.
 */
export const WeeklySummaryCard = ({ summary }: WeeklySummaryCardProps) => {
  const todayIndex = (new Date().getDay() + 6) % 7; // Mon=0

  return (
    <motion.div
      variants={scaleInVariants}
      initial="hidden"
      animate="visible"
      className="glass-card rounded-2xl p-6 flex flex-col gap-6"
    >
      <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
        Weekly Summary
      </span>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-thin">{summary.completionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Completion</p>
        </div>
        <div>
          <p className="text-2xl font-thin">{summary.habitsCompleted}</p>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-thin">{summary.streak}</p>
          <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
        </div>
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end gap-1.5 h-16" aria-label="Daily completion rates this week">
        {summary.dailyRates.map((rate, index) => (
          <div key={DAYS[index]} className="flex flex-col items-center gap-1.5 flex-1">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.1 + index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full rounded-sm origin-bottom ${
                index === todayIndex ? 'bg-foreground' : 'bg-foreground/20'
              }`}
              style={{ height: `${Math.max(rate, 4)}%` }}
              role="img"
              aria-label={`${DAYS[index]}: ${rate}%`}
            />
            <span
              className={`text-[9px] uppercase tracking-wider ${
                index === todayIndex ? 'text-foreground' : 'text-muted-foreground/50'
              }`}
            >
              {DAYS[index]}
            </span>
          </div>
        ))}
      </div>

      {summary.totalHabits === 0 && (
        <p className="text-xs text-muted-foreground text-center -mt-2">
          Start adding habits to see your weekly breakdown
        </p>
      )}
    </motion.div>
  );
};
