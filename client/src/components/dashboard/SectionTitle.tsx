import { motion } from 'framer-motion';
import { fadeUpVariants } from '../../animations/variants';
import { cn } from '../../utils/cn';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

/** Reusable editorial section heading used across all dashboard sections. */
export const SectionTitle = ({ title, subtitle, className, action }: SectionTitleProps) => {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex items-end justify-between mb-4', className)}
    >
      <div>
        <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground/70 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
};
