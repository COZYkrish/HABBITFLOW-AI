import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransitionVariants } from '../../../animations/variants';
import { Calendar, CalendarRange, CalendarDays } from 'lucide-react';
import { ReportViewer } from './ReportViewer';
import { SectionTitle } from '../../../components/dashboard/SectionTitle';

type ReportType = 'weekly' | 'monthly' | 'yearly' | null;

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>(null);

  const reports = [
    { id: 'weekly', title: 'Weekly Report', desc: 'Last 7 days of activity', icon: <CalendarDays className="w-8 h-8" /> },
    { id: 'monthly', title: 'Monthly Report', desc: 'Full calendar month overview', icon: <CalendarRange className="w-8 h-8" /> },
    { id: 'yearly', title: 'Yearly Report', desc: 'Your 12-month journey', icon: <Calendar className="w-8 h-8" /> },
  ] as const;

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto space-y-8"
    >
      <header className="mb-8">
        <h1 className="text-4xl font-thin tracking-tight mb-2">Reports & Exports</h1>
        <p className="text-muted-foreground">Generate beautiful, printable reports of your progress.</p>
      </header>

      <AnimatePresence mode="wait">
        {!activeReport ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id as ReportType)}
                className="glass-card rounded-2xl p-8 text-left group hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="text-muted-foreground mb-4">{report.icon}</div>
                <h3 className="text-xl font-medium mb-2">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.desc}</p>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="viewer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6">
              <button
                onClick={() => setActiveReport(null)}
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Reports
              </button>
            </div>
            <ReportViewer type={activeReport} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
