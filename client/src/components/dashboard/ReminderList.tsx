import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '../../animations/variants';
import type { UpcomingReminder } from '../../types/dashboard.types';

interface ReminderListProps {
  reminders: UpcomingReminder[];
}

const formatCountdown = (isoString: string): string => {
  const diff = new Date(isoString).getTime() - Date.now();
  if (diff < 0) return 'Now';
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  if (minutes < 60) return `in ${minutes}m`;
  return `in ${hours}h`;
};

const formatTime = (isoString: string): string =>
  new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const EmptyReminders = () => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <span className="text-2xl mb-2" aria-hidden="true">◌</span>
    <p className="text-sm text-muted-foreground">No upcoming reminders</p>
    <p className="text-xs text-muted-foreground/60 mt-1">Reminders will appear here</p>
  </div>
);

/**
 * ReminderList — displays upcoming habit reminders.
 * Notification logic added in Phase 10.
 */
export const ReminderList = ({ reminders }: ReminderListProps) => {
  if (reminders.length === 0) return <EmptyReminders />;

  return (
    <motion.ul
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
      aria-label="Upcoming reminders"
    >
      {reminders.map((reminder) => (
        <motion.li
          key={reminder.id}
          variants={staggerItemVariants}
          className="glass-card rounded-xl p-4 flex items-center gap-3"
        >
          <span className="text-xl flex-shrink-0" aria-hidden="true">{reminder.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{reminder.habitName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatTime(reminder.scheduledAt)}</p>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0 tabular-nums">
            {formatCountdown(reminder.scheduledAt)}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
};
