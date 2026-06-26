import { useState } from 'react';
import { useExport } from '../../hooks/useExport';
import { Download, FileText, Table, FileJson, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  type: 'weekly' | 'monthly' | 'yearly';
}

export const ExportMenu = ({ type }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, error, handleExport } = useExport();

  const handleDownload = async (format: 'pdf' | 'csv' | 'json') => {
    setIsOpen(false);
    await handleExport(type, format);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white/5 transition-colors text-sm uppercase tracking-wider"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-2 z-50 flex flex-col gap-1"
            >
              <button
                onClick={() => handleDownload('pdf')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-left"
              >
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>PDF Document</span>
              </button>
              <button
                onClick={() => handleDownload('csv')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-left"
              >
                <Table className="w-4 h-4 text-muted-foreground" />
                <span>CSV Spreadsheet</span>
              </button>
              <button
                onClick={() => handleDownload('json')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-left"
              >
                <FileJson className="w-4 h-4 text-muted-foreground" />
                <span>JSON Data</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export Progress Modal */}
      <AnimatePresence>
        {(state === 'generating' || state === 'downloading' || state === 'success' || state === 'error') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center gap-4"
            >
              {(state === 'generating' || state === 'downloading') && (
                <>
                  <Loader2 className="w-12 h-12 text-foreground animate-spin" />
                  <div>
                    <h3 className="text-lg font-medium">{state === 'generating' ? 'Gathering Data...' : 'Packaging File...'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Preparing your {type} report</p>
                  </div>
                </>
              )}
              {state === 'success' && (
                <>
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                  <div>
                    <h3 className="text-lg font-medium">Download Complete</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your report is ready.</p>
                  </div>
                </>
              )}
              {state === 'error' && (
                <>
                  <AlertCircle className="w-12 h-12 text-red-500" />
                  <div>
                    <h3 className="text-lg font-medium">Export Failed</h3>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
