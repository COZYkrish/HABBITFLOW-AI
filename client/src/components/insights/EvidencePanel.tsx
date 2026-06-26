import { motion, AnimatePresence } from 'framer-motion';
import type { InsightEvidence } from '../../types/insights.types';
import { useState } from 'react';

export const EvidencePanel = ({ evidence }: { evidence: InsightEvidence[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="mt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
          <path d="M5 3L9 7l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        View Supporting Evidence
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1 flex flex-col gap-2">
              {evidence.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-foreground/[0.03] border border-border/30">
                  <span className="text-muted-foreground">{item.metric}</span>
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-foreground">{item.value}</span>
                    {item.comparison && (
                      <span className="text-[10px] text-muted-foreground/70">{item.comparison}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
