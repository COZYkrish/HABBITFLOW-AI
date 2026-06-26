import { motion } from 'framer-motion';

interface XPProgressProps {
  currentXP: number;
  xpRequired: number;
  label?: string;
}

export const XPProgress = ({ currentXP, xpRequired, label }: XPProgressProps) => {
  const percentage = Math.min(100, Math.max(0, (currentXP / Math.max(1, xpRequired)) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
          <span className="text-xs font-medium text-foreground">
            {currentXP} / {xpRequired} XP
          </span>
        </div>
      )}
      
      <div className="relative h-3 w-full bg-foreground/[0.04] rounded-full overflow-hidden shadow-inner">
        {/* Glow behind the progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-foreground blur-md opacity-20"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        
        {/* Actual progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-foreground rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
