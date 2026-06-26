import { motion, AnimatePresence } from 'framer-motion';
import { BellRing } from 'lucide-react';
import { useWebNotifications } from '../../hooks/useWebNotifications';

export const PermissionBanner = () => {
  const { permission, requestPermission } = useWebNotifications();

  if (permission === 'granted' || permission === 'denied') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
        className="bg-primary text-primary-foreground p-3 flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="bg-background/20 p-2 rounded-full">
            <BellRing className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium">Enable browser notifications to receive timely reminders.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={requestPermission}
            className="px-4 py-1.5 bg-background text-foreground text-xs font-semibold rounded-full hover:bg-background/90 transition-colors"
          >
            Enable
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
