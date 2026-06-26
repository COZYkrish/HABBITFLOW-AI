import { motion } from 'framer-motion';
import { useNotificationHistory } from '../../hooks/useNotifications';
import { format } from 'date-fns';

export const NotificationHistory = () => {
  const { history, isLoading } = useNotificationHistory();

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-8">Loading history...</div>;
  }

  if (history.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed border-border rounded-xl">No notification history found.</div>;
  }

  return (
    <div className="relative border-l border-border/50 ml-4 pl-6 space-y-8 py-4">
      {history.map((notif, index) => (
        <motion.div
          key={notif._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative"
        >
          {/* Timeline Dot */}
          <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-background ${notif.status === 'sent' ? 'bg-primary' : 'bg-muted-foreground'}`} />
          
          <div className="glass-card p-4 rounded-xl border border-border/30 max-w-2xl">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span>{notif.icon || '💬'}</span>
                <span className="font-medium text-sm text-foreground">{notif.title}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">
                {format(new Date(notif.sentAt), 'MMM d, h:mm a')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{notif.body}</p>
            <div className="flex gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold ${
                notif.status === 'opened' ? 'bg-green-500/10 text-green-500' :
                notif.status === 'snoozed' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-foreground/5 text-muted-foreground'
              }`}>
                {notif.status}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold bg-primary/10 text-primary">
                {notif.type.replace('_', ' ')}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
