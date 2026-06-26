import { Search, Bell, Settings, Menu } from 'lucide-react';
import { UserAvatar } from '../../shared/UserAvatar';
import { useState } from 'react';
import { NotificationCenter } from '../../notifications/NotificationCenter';
import { useUpcomingNotifications } from '../../../hooks/useNotifications';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface TopNavbarProps {
  user: { name: string; avatar?: string };
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export const TopNavbar = ({ user, onMenuToggle }: TopNavbarProps) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { upcoming } = useUpcomingNotifications();
  
  // Build avatar URL if present
  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';
  const avatarUrl = user.avatar ? `${baseURL}${user.avatar}` : undefined;
  
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between"
      >
        {/* Left side (Search) */}
        <div className="flex-1 flex items-center gap-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 -ml-2 rounded-lg hover:bg-foreground/5 text-muted-foreground transition-colors md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="relative w-64 hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full bg-foreground/5 border border-transparent rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right side (Actions & Profile) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {upcoming.length > 0 && (
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
              )}
            </button>
            <Link to="/dashboard/settings" className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard/profile" className="block hover:opacity-80 transition-opacity">
              <UserAvatar name={user.name} src={avatarUrl} size="sm" />
            </Link>
          </div>
        </div>
      </motion.header>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
