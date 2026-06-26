import { Search, Bell, Settings } from 'lucide-react';
import { UserAvatar } from '../../shared/UserAvatar';
import { useState } from 'react';
import { NotificationCenter } from '../../notifications/NotificationCenter';
import { useUpcomingNotifications } from '../../../hooks/useNotifications';
import { motion } from 'framer-motion';

interface TopNavbarProps {
  user: { name: string; avatar?: string };
}

export const TopNavbar = ({ user }: TopNavbarProps) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { upcoming } = useUpcomingNotifications();
  
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between"
      >
        {/* Left side (Search) */}
        <div className="flex-1 flex items-center">
          <div className="relative w-64">
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
            <button className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <UserAvatar name={user.name} src={user.avatar} size="sm" />
          </div>
        </div>
      </motion.header>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
