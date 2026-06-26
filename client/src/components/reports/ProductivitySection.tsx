import { motion } from 'framer-motion';
import { ReportProductivityDTO } from '../../../server/src/modules/reports/reports.types';

interface Props {
  data: ReportProductivityDTO;
}

export const ProductivitySection = ({ data }: Props) => {
  const metrics = [
    { label: 'Consistency', value: data.consistency },
    { label: 'Completion', value: data.completion },
    { label: 'Momentum', value: data.momentum },
    { label: 'Routine', value: data.routineStability },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-light tracking-wide uppercase">Productivity Diagnostics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={metric.label} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4">
            {/* Simple circular gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-border" />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="175.93"
                  initial={{ strokeDashoffset: 175.93 }}
                  whileInView={{ strokeDashoffset: 175.93 - (175.93 * metric.value) / 100 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 1.5, ease: 'easeOut' }}
                  className="text-foreground"
                />
              </svg>
              <span className="text-sm font-medium">{metric.value}%</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{metric.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
