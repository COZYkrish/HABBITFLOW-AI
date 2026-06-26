import { motion } from 'framer-motion';
import { cardHoverVariants } from '../../animations/variants';
import { CheckCircle, Clock } from 'lucide-react';

interface ChallengeCardProps {
  type: 'daily' | 'weekly';
  title: string;
  description: string;
  currentProgress: number;
  targetProgress: number;
  xpReward: number;
  status: 'active' | 'completed' | 'expired' | 'failed';
  expiresIn?: string;
}

export const ChallengeCard = ({ type, title, description, currentProgress, targetProgress, xpReward, status, expiresIn }: ChallengeCardProps) => {
  const percentage = Math.min(100, Math.round((currentProgress / targetProgress) * 100));
  const isCompleted = status === 'completed';

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className="glass-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1 block">
            {type === 'daily' ? 'Daily Goal' : 'Weekly Challenge'}
          </span>
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-foreground/[0.05] text-foreground">
            +{xpReward} XP
          </span>
          {isCompleted && <CheckCircle size={14} className="text-green-500" />}
        </div>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">
        {description}
      </p>

      <div className="mt-2">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
          <span>{currentProgress} / {targetProgress}</span>
          {!isCompleted && expiresIn && (
            <span className="flex items-center gap-1">
              <Clock size={10} /> {expiresIn}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full bg-foreground/[0.05] rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${isCompleted ? 'bg-green-500/80' : 'bg-foreground/60'}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
