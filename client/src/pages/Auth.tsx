import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-foreground/[0.03] via-transparent to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-8 left-8 z-10"
      >
        <Link to="/" className="text-xl font-thin tracking-tighter">
          HabitFlow <span className="font-medium">AI</span>
        </Link>
      </motion.div>

      <div className="w-full relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
