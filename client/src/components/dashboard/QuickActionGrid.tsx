import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '../../animations/variants';
import { AuthService } from '../../api/auth.service';

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
 * Disabled items are future-ready stubs for later phases.
 */
export const QuickActionGrid = () => {
  const navigate = useNavigate();

  const ACTIONS: QuickAction[] = [
    {
      id: 'create-habit',
      label: 'Create Habit',
      icon: '✦',
      description: 'Start a new daily ritual',
      href: '/dashboard/habits/new',
      disabled: true, // Phase 5
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '◎',
      description: 'View your progress charts',
      href: '/dashboard/analytics',
      disabled: true, // Phase 6
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '▤',
      description: 'Weekly & monthly summaries',
      href: '/dashboard/reports',
      disabled: true, // Phase 7
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '◉',
      description: 'Manage your account',
      href: '/dashboard/profile',
      disabled: false,
    },
  ];

  const handleAction = (action: QuickAction) => {
    if (action.disabled) return;
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      navigate(action.href);
    }
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3"
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
          className="glass-card rounded-2xl p-5 flex flex-col gap-3 text-left transition-colors
                     hover:bg-foreground/[0.03] disabled:opacity-40 disabled:cursor-not-allowed
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          <span className="text-2xl" aria-hidden="true">{action.icon}</span>
          <div>
            <p className="text-sm font-medium text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
          </div>
          {action.disabled && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">
              Coming soon
            </span>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};
