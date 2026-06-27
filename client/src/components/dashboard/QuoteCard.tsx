import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeVariants } from '../../animations/variants';
import GlassSurface from '../ui/GlassSurface';

const QUOTES: { text: string; author: string }[] = [
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { text: 'Motivation gets you started. Habit keeps you going.', author: 'Jim Ryun' },
  { text: 'The secret of your future is hidden in your daily routine.', author: 'Mike Murdock' },
  { text: 'Chains of habit are too light to be felt until they are too heavy to be broken.', author: 'Warren Buffett' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { text: 'First forget inspiration. Habit is more dependable.', author: 'Octavia Butler' },
];

const getDailyQuote = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
  return QUOTES[dayOfYear % QUOTES.length];
};

/**
 * QuoteCard — daily rotating motivational quote.
 * Fade animation on mount. Ready for future API integration.
 */
export const QuoteCard = () => {
  const [quote, setQuote] = useState(getDailyQuote);
  const [visible, setVisible] = useState(true);

  // Refresh at midnight
  useEffect(() => {
    const msUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      return midnight.getTime() - now.getTime();
    };

    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setQuote(getDailyQuote());
        setVisible(true);
      }, 400);
    }, msUntilMidnight());

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative z-0 overflow-hidden rounded-2xl p-6 flex flex-col gap-4">
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <GlassSurface width="100%" height="100%" borderRadius={16} />
      </div>
      <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
        Daily Reflection
      </span>

      <AnimatePresence mode="wait">
        {visible && (
          <motion.blockquote
            key={quote.text}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-3"
          >
            <p className="text-base font-light leading-relaxed text-foreground italic">
              &ldquo;{quote.text}&rdquo;
            </p>
            <footer className="text-xs text-muted-foreground not-italic">
              — {quote.author}
            </footer>
          </motion.blockquote>
        )}
      </AnimatePresence>
    </div>
  );
};
