import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { fadeUpVariants } from '../animations/variants';

/**
 * PlaceholderPage — displayed for future-phase dashboard routes.
 * Will be replaced when the corresponding phase is implemented.
 */
export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const section = pathname.split('/').pop() ?? 'page';
  const title = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center"
    >
      <div className="glass-card rounded-3xl p-12 max-w-md">
        <span className="text-4xl mb-6 block" aria-hidden="true">◌</span>
        <h1 className="text-2xl font-thin mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground">
          This section is coming in a future phase.
        </p>
      </div>
    </motion.div>
  );
}
