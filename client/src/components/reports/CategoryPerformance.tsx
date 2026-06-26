import { motion } from 'framer-motion';
import type { ReportCategoryPerformanceDTO } from '../../../../server/src/modules/reports/reports.types';

interface Props {
  data: ReportCategoryPerformanceDTO[];
}

export const CategoryPerformance = ({ data }: Props) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-light tracking-wide uppercase">Category Breakdown</h2>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        {data.map((cat, i) => (
          <div key={cat.category} className="space-y-2">
            <div className="flex justify-between text-xs tracking-wider uppercase">
              <span className="font-medium text-foreground">{cat.category}</span>
              <span className="text-muted-foreground">{cat.completionRate}% ({cat.timeInvested}m)</span>
            </div>
            <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${cat.completionRate}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1, ease: 'easeOut' }}
                className="h-full bg-foreground rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
