import { motion } from 'framer-motion';
import { QuoteCard } from '../QuoteCard';
import type { DashboardSummary } from '../../../types/dashboard.types';
import { ProgressRing } from '../ProgressRing';

interface RightContextPanelProps {
  data?: DashboardSummary;
}

/**
 * RightContextPanel — auxiliary panel shown on large screens only.
 * Contains quick stats and the daily quote.
 */
export const RightContextPanel = ({ data }: RightContextPanelProps) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="hidden xl:flex flex-col gap-5 w-72 flex-shrink-0"
      aria-label="Context panel"
    >
      {/* Daily Progress */}
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4">
        <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground self-start">
          Today&rsquo;s Progress
        </span>
        <ProgressRing
          value={data?.productivityScore ?? 0}
          label="Score"
          size={140}
          strokeWidth={9}
        />
      </div>

      {/* Quick stats */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground block">
          At a Glance
        </span>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Streak', value: data?.currentStreak ?? 0, icon: '🔥' },
            { label: 'Best', value: data?.bestStreak ?? 0, icon: '⭐' },
            { label: 'Today', value: `${data?.todayHabits?.length ?? 0}`, icon: '📋' },
            { label: 'Score', value: data?.productivityScore ?? 0, icon: '◎' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-base" aria-hidden="true">{stat.icon}</span>
              <p className="text-lg font-thin tabular-nums">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <QuoteCard offset={1} />
    </motion.aside>
  );
};
