import { motion } from 'framer-motion';
import { cardHoverVariants } from '../../animations/variants';

export interface AchievementCardProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    xpReward: number;
    currentProgress: number;
    targetProgress: number;
    percentageComplete: number;
    unlocked: boolean;
  };
}

const TIER_STYLES: Record<string, string> = {
  bronze: 'border-[#CD7F32]/20 shadow-[0_0_15px_rgba(205,127,50,0.1)]',
  silver: 'border-[#C0C0C0]/20 shadow-[0_0_15px_rgba(192,192,192,0.1)]',
  gold: 'border-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]',
  platinum: 'border-[#E5E4E2]/30 shadow-[0_0_15px_rgba(229,228,226,0.15)]',
  diamond: 'border-[#b9f2ff]/30 shadow-[0_0_20px_rgba(185,242,255,0.2)]',
};

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const { title, description, icon, tier, xpReward, percentageComplete, unlocked, targetProgress, currentProgress } = achievement;
  
  const tierClass = unlocked ? TIER_STYLES[tier] : 'border-border/40';

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className={`glass-card rounded-2xl p-5 flex flex-col justify-between w-full h-[180px] sm:w-[320px] transition-all duration-300 relative overflow-hidden group border ${tierClass} ${!unlocked ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-foreground/[0.03] flex items-center justify-center text-2xl border border-foreground/[0.05]">
            {icon}
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground">{title}</h3>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {tier} TIER • {xpReward} XP
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 z-10">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>
        
        {!unlocked && (
          <div className="w-full">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{currentProgress} / {targetProgress}</span>
            </div>
            <div className="h-1.5 w-full bg-foreground/[0.05] rounded-full overflow-hidden">
              <div 
                className="h-full bg-foreground/40 rounded-full transition-all duration-500" 
                style={{ width: `${percentageComplete}%` }} 
              />
            </div>
          </div>
        )}
      </div>

      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </motion.div>
  );
};
