import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { CelebrationRenderer } from './CelebrationRenderer';
import { CelebrationEvent } from '../../../server/src/modules/gamification/engine/celebration.engine';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';

interface CelebrationModalProps {
  event: CelebrationEvent;
  onClose: () => void;
}

export const CelebrationModal = ({ event, onClose }: CelebrationModalProps) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const getIcon = () => {
    switch (event.type) {
      case 'LEVEL_UP': return <TrendingUp size={48} className="text-foreground" />;
      case 'ACHIEVEMENT_UNLOCKED': return <Trophy size={48} className="text-foreground" />;
      case 'MILESTONE_REACHED': return <Star size={48} className="text-foreground" />;
      case 'CHALLENGE_COMPLETED': return <Target size={48} className="text-foreground" />;
      default: return <Trophy size={48} className="text-foreground" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: -20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm mx-4 p-8 glass-card rounded-3xl flex flex-col items-center text-center shadow-2xl border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <CelebrationRenderer />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            className="w-24 h-24 rounded-full bg-foreground/[0.05] flex items-center justify-center mb-6 z-10 border border-foreground/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            {getIcon()}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-semibold text-foreground tracking-tight mb-2 z-10"
          >
            {event.title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground z-10"
          >
            {event.subtitle}
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onClose}
            className="mt-8 px-8 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors z-10"
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
