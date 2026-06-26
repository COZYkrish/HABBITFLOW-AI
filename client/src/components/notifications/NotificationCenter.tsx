import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import { useNotificationHistory } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter = ({ isOpen, onClose }: Props) => {
  const { history, markRead } = useNotificationHistory();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full md:w-96 bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-foreground" />
                <h2 className="font-medium text-lg">Notifications</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mb-4 opacity-20" />
                  <p>You're all caught up!</p>
                </div>
              ) : (
                history.map((notif) => (
                  <motion.div
                    key={notif._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border flex gap-4 ${
                      notif.status === 'sent' ? 'bg-foreground/5 border-primary/20' : 'bg-transparent border-border'
                    }`}
                    onClick={() => notif.status === 'sent' && markRead(notif._id)}
                  >
                    <div className="text-2xl flex-shrink-0">{notif.icon || '🔔'}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-medium ${notif.status === 'sent' ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(notif.sentAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notif.body}</p>
                    </div>
                    {notif.status === 'sent' && (
                      <div className="flex flex-col justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
