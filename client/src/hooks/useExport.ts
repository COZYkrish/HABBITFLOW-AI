import { useState } from 'react';
import { exportPdf, exportCsv, exportJson } from '../api/reports.service';

type ExportState = 'idle' | 'generating' | 'downloading' | 'success' | 'error';

export const useExport = () => {
  const [state, setState] = useState<ExportState>('idle');
  const [error, setError] = useState<string | null>(null);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExport = async (type: 'weekly' | 'monthly' | 'yearly', format: 'pdf' | 'csv' | 'json') => {
    setState('generating');
    setError(null);
    try {
      let blob: Blob;
      if (format === 'pdf') blob = await exportPdf(type);
      else if (format === 'csv') blob = await exportCsv(type);
      else blob = await exportJson(type);

      setState('downloading');
      
      const ext = format;
      const filename = `habitflow-${type}-report.${ext}`;
      
      // Artificial delay for smooth animated UX
      setTimeout(() => {
        downloadBlob(blob, filename);
        setState('success');
        setTimeout(() => setState('idle'), 3000);
      }, 800);
      
    } catch (err: any) {
      setError(err.message || 'Export failed');
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  return { state, error, handleExport };
};
