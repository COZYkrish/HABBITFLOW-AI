import { motion } from 'framer-motion';
import { staggerContainerVariants } from '../../animations/variants';
import type { ActivityItem } from '../../types/dashboard.types';
import { cn } from '../../utils/cn';

interface ActivityTimelineProps {
  items: ActivityItem[];
}

const TYPE_ICON: Record<ActivityItem['type'], string> = {
  completed: '✓',
  skipped: '○',
  streak: '🔥',
  achievement: '★',
};

const TYPE_COLOR: Record<ActivityItem['type'], string> = {
  completed: 'text-foreground',
  skipped: 'text-muted-foreground',
  streak: 'text-foreground',
  achievement: 'text-foreground',
};

const formatRelativeTime = (isoString: string): string => {
  const date = new Date(isoString);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

const EmptyActivity = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <span className="text-3xl mb-3" aria-hidden="true">◌</span>
    <p className="text-sm text-muted-foreground">No recent activity yet</p>
    <p className="text-xs text-muted-foreground/60 mt-1">
      Your activity will appear here once you start completing habits
    </p>
  </div>
);

/**
 * ActivityTimeline — animated vertical timeline of recent habit activity.
 */
export const ActivityTimeline = ({ items }: ActivityTimelineProps) => {
  if (items.length === 0) return <EmptyActivity />;

  return (
    <motion.ol
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="relative space-y-0"
      aria-label="Recent activity"
    >
      {/* Vertical line */}
      <div
        className="absolute left-[15px] top-4 bottom-4 w-px bg-border"
        aria-hidden="true"
      />

      {items.map((item, index) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start gap-4 pb-5 last:pb-0"
        >
          {/* Timeline dot */}
          <div
            className={cn(
              'relative z-10 w-8 h-8 rounded-full glass-card flex items-center justify-center flex-shrink-0 text-xs',
              TYPE_COLOR[item.type]
            )}
            aria-hidden="true"
          >
            {TYPE_ICON[item.type]}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1.5 min-w-0">
            <p className="text-sm text-foreground leading-snug">{item.description}</p>
            <time
              dateTime={item.timestamp}
              className="text-xs text-muted-foreground mt-1 block"
            >
              {formatRelativeTime(item.timestamp)}
            </time>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
};
