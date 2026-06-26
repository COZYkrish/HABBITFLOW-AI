import { motion } from 'framer-motion';

interface LevelCardProps {
  currentLevel: number;
  currentXP: number;
  xpRequired: number;
}

export const LevelCard = ({ currentLevel, currentXP, xpRequired }: LevelCardProps) => {
  const progress = Math.min(100, Math.round((currentXP / Math.max(1, xpRequired)) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-foreground/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex flex-col z-10">
        <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-1">
          Current Status
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-light tracking-tight text-foreground">
            Level {currentLevel}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          <span className="text-foreground font-medium">{currentXP}</span> / {xpRequired} XP
        </p>
      </div>

      <div className="relative w-24 h-24 flex items-center justify-center z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-foreground/[0.05]"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-foreground"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-medium">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};
