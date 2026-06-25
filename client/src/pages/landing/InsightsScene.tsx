/**
 * Scene 5 — Smart Insights
 * Showcases HabitFlow Intelligence with animated insight cards.
 */
import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertTriangle, Clock, Calendar, BarChart2 } from 'lucide-react';
import {
  staggerContainerVariants,
  staggerItemVariants,
  cardHoverVariants,
  viewportOnce,
} from '../../animations/variants';

type InsightType = 'success' | 'warning' | 'info' | 'trend';

interface Insight {
  id: number;
  type: InsightType;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  message: string;
  detail: string;
}

const INSIGHTS: Insight[] = [
  {
    id: 1,
    type: 'success',
    icon: Clock,
    label: 'Peak Performance',
    message: 'You complete habits 31% more often before 8 PM.',
    detail: 'Schedule important habits in the early evening for maximum consistency.',
  },
  {
    id: 2,
    type: 'trend',
    icon: Calendar,
    label: 'Strongest Day',
    message: 'Wednesday is your strongest day of the week.',
    detail: 'You maintain a 94% completion rate every Wednesday.',
  },
  {
    id: 3,
    type: 'success',
    icon: TrendingUp,
    label: 'Positive Trend',
    message: 'Reading consistency improved by 18% this month.',
    detail: 'Your longest reading streak so far is 14 days.',
  },
  {
    id: 4,
    type: 'warning',
    icon: AlertTriangle,
    label: 'At Risk',
    message: 'Your Evening Run streak is at risk today.',
    detail: "You've skipped twice this week — act now to keep your streak alive.",
  },
  {
    id: 5,
    type: 'info',
    icon: BarChart2,
    label: 'Deep Insight',
    message: 'Cold Shower has a 100% completion rate for 30 days.',
    detail: 'This is your most consistent habit. It anchors your morning routine.',
  },
  {
    id: 6,
    type: 'trend',
    icon: Zap,
    label: 'Momentum',
    message: 'Best week on record — 92% overall completion.',
    detail: 'You outperformed your monthly average by 17 percentage points.',
  },
];

const TYPE_STYLES: Record<InsightType, { border: string; icon: string; badge: string }> = {
  success: {
    border: 'border-foreground/20',
    icon: 'text-foreground/70',
    badge: 'bg-foreground/10 text-foreground',
  },
  warning: {
    border: 'border-yellow-500/20 dark:border-yellow-400/15',
    icon: 'text-yellow-600 dark:text-yellow-400',
    badge: 'bg-yellow-50 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-300',
  },
  info: {
    border: 'border-border',
    icon: 'text-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  trend: {
    border: 'border-foreground/10',
    icon: 'text-foreground/60',
    badge: 'bg-foreground/5 text-foreground/70',
  },
};

function InsightCard({ insight, delay }: { insight: Insight; delay: number }) {
  const style = TYPE_STYLES[insight.type];
  const Icon = insight.icon;

  return (
    <motion.article
      variants={cardHoverVariants}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      viewport={viewportOnce}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card rounded-2xl p-5 border ${style.border} flex flex-col gap-3`}
      aria-label={insight.message}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`p-2 rounded-xl bg-muted/50 ${style.icon}`}>
          <Icon size={15} className={style.icon} />
        </div>
        <span className={`text-[10px] font-medium uppercase tracking-widest px-2 py-1 rounded-full ${style.badge}`}>
          {insight.label}
        </span>
      </div>

      <p className="text-sm font-medium leading-snug text-foreground">
        {insight.message}
      </p>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {insight.detail}
      </p>
    </motion.article>
  );
}

export default function InsightsScene() {
  return (
    <section
      id="insights"
      className="relative py-32 overflow-hidden"
      aria-labelledby="insights-headline"
    >
      {/* Background blur */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-0 top-1/4 w-96 h-96 rounded-full bg-foreground/[0.02] blur-3xl" />
        <div className="absolute left-0 bottom-1/4 w-80 h-80 rounded-full bg-foreground/[0.015] blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-20"
        >
          <motion.div variants={staggerItemVariants} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground">
              <Zap size={11} />
              HabitFlow Intelligence
            </span>
          </motion.div>
          <motion.h2
            id="insights-headline"
            variants={staggerItemVariants}
            className="text-headline font-thin"
          >
            Your habits, deeply
            <br />
            understood.
          </motion.h2>
          <motion.p
            variants={staggerItemVariants}
            className="mt-4 text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed"
          >
            HabitFlow Intelligence analyses your patterns and surfaces personalised insights — 
            so you always know exactly where to focus.
          </motion.p>
        </motion.div>

        {/* Insight cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INSIGHTS.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
