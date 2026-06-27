import { useEffect, useState } from 'react';
import DecryptedText from '../ui/DecryptedText';
import GlassSurface from '../ui/GlassSurface';
import { motion } from 'framer-motion';
import { fadeUpVariants } from '../../animations/variants';

interface WelcomeCardProps {
  name: string;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still burning the midnight oil';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

const MOTIVATIONAL_MESSAGES = [
  'Continue building your consistency.',
  'Every habit is a vote for the person you want to become.',
  'Small actions, compounded daily, create extraordinary results.',
  'Your streak is your momentum. Protect it.',
  'Today is another chance to get it right.',
];

const getDailyMessage = () => {
  const dayIndex = new Date().getDate() % MOTIVATIONAL_MESSAGES.length;
  return MOTIVATIONAL_MESSAGES[dayIndex];
};

/**
 * WelcomeCard — hero glass card with dynamic greeting, time, and animated background.
 */
export const WelcomeCard = ({ name }: WelcomeCardProps) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  const firstName = name.split(' ')[0];
  const greeting = getGreeting();
  const message = getDailyMessage();

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[220px] flex flex-col justify-between z-0"
    >
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <GlassSurface width="100%" height="100%" borderRadius={24} useComplex={true} />
      </div>
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/[0.03] border border-white/[0.06]"
        />
        <motion.div
          animate={{ x: [0, -12, 0], y: [0, 18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-white/[0.02] border border-white/[0.04]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/[0.02]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3"
        >
          {date}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-thin tracking-tight text-foreground"
        >
          <DecryptedText text={`${greeting},`} animateOn="view" speed={60} maxIterations={15} />{' '}
          <span className="font-light">
            <DecryptedText text={`${firstName}.`} animateOn="view" speed={70} maxIterations={20} />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="text-muted-foreground mt-3 text-sm md:text-base max-w-lg"
        >
          {message}
        </motion.p>
      </div>

      {/* Time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 self-end"
      >
        <span className="text-2xl font-thin tabular-nums text-muted-foreground">{time}</span>
      </motion.div>
    </motion.div>
  );
};
