import { useAuthStore } from '../../../store/authStore';
import { useThemeStore } from '../../../store/themeStore';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';

interface TopNavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2a4 4 0 0 0-4 4v3l-1 1.5h10L12 9V6a4 4 0 0 0-4-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * TopNavbar — sticky glass navigation bar for the dashboard.
 */
export const TopNavbar = ({ onMenuToggle, isSidebarOpen }: TopNavbarProps) => {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U';

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-20 glass border-b border-border/50 px-4 md:px-6 h-14 flex items-center justify-between gap-4"
      role="banner"
    >
      {/* Left: mobile menu + date */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          className="lg:hidden"
        >
          <MenuIcon />
        </Button>

        <span className="text-xs text-muted-foreground hidden sm:block">{today}</span>
      </div>

      {/* Center: search placeholder */}
      <button
        type="button"
        className="hidden md:flex flex-1 max-w-xs items-center gap-2 px-4 h-8 rounded-lg
                   bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-xs text-muted-foreground
                   hover:border-white/30 hover:bg-white/20 dark:hover:bg-white/5 transition-colors
                   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
        aria-label="Search (coming soon)"
        disabled
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="8" y1="8" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Search…
      </button>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notifications (placeholder) */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications (coming soon)"
          disabled
          className="opacity-40"
        >
          <BellIcon />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </Button>

        {/* Avatar */}
        <button
          type="button"
          aria-label="User profile"
          className="w-8 h-8 rounded-full glass-card flex items-center justify-center
                     text-xs font-medium hover:bg-foreground/[0.06] transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          {initials}
        </button>
      </div>
    </motion.header>
  );
};
