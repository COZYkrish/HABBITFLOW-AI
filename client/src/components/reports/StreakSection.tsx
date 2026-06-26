import { motion } from 'framer-motion';
import { ReportStreakDTO } from '../../../server/src/modules/reports/reports.types';
import { Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface Props {
  data: ReportStreakDTO;
}

export const StreakSection = ({ data }: Props) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-light tracking-wide uppercase">Streak Analysis</h2>
      </div>

      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-around">
        
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
            <Flame className="w-8 h-8 text-foreground" />
          </div>
          <div className="text-3xl font-thin">{data.currentStreak} <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Days</span></div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Current Streak</div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
            <Flame className="w-8 h-8 text-foreground/50" />
          </div>
          <div className="text-3xl font-thin">{data.bestStreak} <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Days</span></div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">All-Time Best</div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
            {data.trend === 'up' && <ArrowUp className="w-8 h-8 text-foreground" />}
            {data.trend === 'down' && <ArrowDown className="w-8 h-8 text-foreground/50" />}
            {data.trend === 'stable' && <Minus className="w-8 h-8 text-foreground/80" />}
          </div>
          <div className="text-xl font-thin capitalize">{data.trend}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Momentum Trend</div>
        </div>

      </div>
    </section>
  );
};
