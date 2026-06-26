import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';
import { AuthService } from '../../../api/auth.service';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡', href: '/dashboard' },
  { id: 'habits', label: 'Habits', icon: '◈', href: '/dashboard/habits' },
  { id: 'analytics', label: 'Analytics', icon: '◎', href: '/dashboard/analytics' },
  { id: 'reports', label: 'Reports', icon: '▤', href: '/dashboard/reports', disabled: true },
  { id: 'achievements', label: 'Achievements', icon: '★', href: '/dashboard/achievements', disabled: true },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: '◉', href: '/dashboard/profile' },
  { id: 'settings', label: 'Settings', icon: '◌', href: '/dashboard/settings', disabled: true },
];

const CollapseIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={cn('transition-transform duration-300', isOpen ? '' : 'rotate-180')}
  >
    <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Sidebar — premium collapsible navigation sidebar.
 * On desktop: collapses to icon-only rail.
 * On mobile: slides in as overlay.
 */
export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await AuthService.logout();
  };

  const handleNav = (item: NavItem) => {
    if (item.disabled) return;
    navigate(item.href);
    onClose?.();
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.nav
        animate={{ width: isOpen ? 220 : 64 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-30 flex flex-col',
          'glass border-r border-border/50 flex-shrink-0 overflow-hidden',
          // On mobile, always show full width when open, hidden when closed
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ minHeight: '100%' }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 flex-shrink-0 border-b border-border/50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <span className="text-background text-xs font-bold">H</span>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  HabitFlow AI
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Primary navigation */}
        <ul className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto no-scrollbar" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNav(item)}
                disabled={item.disabled}
                aria-label={item.label}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
                  isActive(item.href)
                    ? 'bg-foreground/[0.08] text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]',
                  item.disabled && 'opacity-35 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground'
                )}
              >
                <span className="text-base flex-shrink-0" aria-hidden="true">{item.icon}</span>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          ))}
        </ul>

        {/* Bottom actions */}
        <div className="border-t border-border/50 py-4 px-2 space-y-0.5">
          {BOTTOM_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              disabled={item.disabled}
              aria-label={item.label}
              className={cn(
                'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
                'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]',
                item.disabled && 'opacity-35 cursor-not-allowed hover:bg-transparent'
              )}
            >
              <span className="text-base flex-shrink-0" aria-hidden="true">{item.icon}</span>
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm transition-colors
                       text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          >
            <span className="text-base flex-shrink-0" aria-hidden="true">↪</span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  Log Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onClose}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="hidden lg:flex w-full items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm
                       text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]
                       transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          >
            <span className="flex-shrink-0">
              <CollapseIcon isOpen={isOpen} />
            </span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap text-xs"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>
    </>
  );
};
