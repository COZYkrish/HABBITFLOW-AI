import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CelebrationEvent } from '../../types/gamification.types';
import { CelebrationModal } from './CelebrationModal';

interface CelebrationQueueContextType {
  enqueueCelebration: (event: CelebrationEvent) => void;
}

const CelebrationQueueContext = createContext<CelebrationQueueContextType | undefined>(undefined);

export const CelebrationQueueProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<CelebrationEvent[]>([]);
  const [isShowing, setIsShowing] = useState(false);

  const enqueueCelebration = useCallback((event: CelebrationEvent) => {
    setQueue((prev) => [...prev, event]);
  }, []);

  const handleNext = () => {
    setQueue((prev) => prev.slice(1));
    setIsShowing(false);
  };

  const currentEvent = queue[0];
  
  if (currentEvent && !isShowing) {
    // Small delay between celebrations
    setTimeout(() => setIsShowing(true), 100);
  }

  return (
    <CelebrationQueueContext.Provider value={{ enqueueCelebration }}>
      {children}
      {isShowing && currentEvent && (
        <CelebrationModal event={currentEvent} onClose={handleNext} />
      )}
    </CelebrationQueueContext.Provider>
  );
};

export const useCelebrationQueue = () => {
  const context = useContext(CelebrationQueueContext);
  if (!context) throw new Error('useCelebrationQueue must be used within CelebrationQueueProvider');
  return context;
};
