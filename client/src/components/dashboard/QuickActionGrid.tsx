import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '../../animations/variants';
import { useHabitStore } from '../../store/habitStore';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * QuickActionGrid — 2×2 grid of primary dashboard actions.
 * "Create Habit" now wired to HabitFormModal (Phase 5).
 */
export const QuickActionGrid = () => {
  const navigate = useNavigate();
  const { openCreateModal } = useHabitStore();

  const ACTIONS: QuickAction[] = [
    {
      id: 'create-habit',
      label: 'New Habit',
      icon: '✦',
      description: 'Start a new daily ritual',
      onClick: openCreateModal,
    },
    {
      id: 'all-habits',
      label: 'All Habits',
      icon: '◈',
      description: 'View & manage habits',
      href: '/dashboard/habits',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '◎',
      description: 'View your progress charts',
      href: '/dashboard/analytics', 
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '▤',
      description: 'Weekly & monthly summaries',
      href: '/dashboard/reports',
      disabled: true,
    },
  ];

  const handleAction = (action: QuickAction) => {
    if (action.disabled) return;
    if (action.onClick) action.onClick();
    else if (action.href) navigate(action.href);
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 grid-rows-2 gap-3 h-full"
      role="list"
      aria-label="Quick actions"
    >
      {ACTIONS.map((action) => (
        <motion.button
          key={action.id}
          variants={staggerItemVariants}
          whileHover={action.disabled ? {} : { y: -3, transition: { duration: 0.2 } }}
          whileTap={action.disabled ? {} : { scale: 0.97 }}
          onClick={() => handleAction(action)}
          disabled={action.disabled}
          aria-label={action.label}
          aria-disabled={action.disabled}
          role="listitem"
          className="glass-card rounded-2xl p-4 flex flex-col justify-center items-center h-full gap-3 text-center transition-colors
                     hover:bg-foreground/[0.03] disabled:opacity-40 disabled:cursor-not-allowed
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          <div className="w-12 h-12 rounded-full bg-foreground/[0.04] flex items-center justify-center shrink-0 mb-1">
            <span className="text-2xl" aria-hidden="true">{action.icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{action.label}</p>
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
          </div>
          {action.disabled && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 shrink-0 bg-background/50 px-2 py-1 rounded-md mt-2">
              Coming soon
            </span>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};
