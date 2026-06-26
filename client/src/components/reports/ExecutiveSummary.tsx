import { motion } from 'framer-motion';
import type { ReportExecutiveSummaryDTO } from '../../../../server/src/modules/reports/reports.types';
import { Trophy, TrendingUp, Target, Star } from 'lucide-react';

interface Props {
  summary: ReportExecutiveSummaryDTO;
}

export const ExecutiveSummary = ({ summary }: Props) => {
  const stats = [
    { label: 'Overall Score', value: `${summary.overallProductivity}%`, icon: <Target className="w-5 h-5" /> },
    { label: 'Consistency', value: `${summary.consistencyScore}%`, icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Habits Done', value: summary.totalHabitsCompleted, icon: <Trophy className="w-5 h-5" /> },
    { label: 'XP Earned', value: `+${summary.xpEarned}`, icon: <Star className="w-5 h-5" /> },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-light tracking-wide uppercase">Executive Summary</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3"
          >
            <div className="text-muted-foreground">{stat.icon}</div>
            <div className="text-3xl font-thin tracking-tight">{stat.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
