import { motion } from 'framer-motion';
import { Clock, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  reminder: {
    _id: string;
    title: string;
    body: string;
    scheduledAt: string;
    icon?: string;
  };
  onSnooze: (id: string) => void;
}

export const ReminderCard = ({ reminder, onSnooze }: Props) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-5 border border-border/50 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center flex-shrink-0 text-2xl">
          {reminder.icon || '🔔'}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground">{reminder.title}</h3>
            <span className="text-[10px] uppercase tracking-widest font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {formatDistanceToNow(new Date(reminder.scheduledAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{reminder.body}</p>
          
          <div className="mt-4 flex items-center gap-2">
            <button 
              onClick={() => onSnooze(reminder._id)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              Snooze
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
