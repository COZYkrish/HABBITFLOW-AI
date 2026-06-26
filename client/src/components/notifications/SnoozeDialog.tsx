import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
}

export const SnoozeDialog = ({ isOpen, onClose, onConfirm }: Props) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);

  const options = [
    { label: '5 minutes', value: 5, icon: Clock },
    { label: '15 minutes', value: 15, icon: Clock },
    { label: '1 hour', value: 60, icon: Clock },
    { label: 'Tomorrow morning', value: 1440, icon: Sun },
    { label: 'Tomorrow evening', value: 2160, icon: Moon },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-md p-6 rounded-2xl relative z-10 shadow-2xl border border-border"
          >
            <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-foreground/5 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Snooze Reminder
            </h2>

            <div className="space-y-2 mb-8">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedMinutes(opt.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all border ${
                    selectedMinutes === opt.value 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border/50 bg-foreground/5 hover:bg-foreground/10 text-foreground'
                  }`}
                >
                  <opt.icon className="w-5 h-5" />
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-medium text-muted-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onConfirm(selectedMinutes);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Snooze
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
