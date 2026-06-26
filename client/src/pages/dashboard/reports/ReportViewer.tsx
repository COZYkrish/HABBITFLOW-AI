import { useWeeklyReport, useMonthlyReport, useYearlyReport } from '../../../hooks/useReports';
import { ExecutiveSummary } from '../../../components/reports/ExecutiveSummary';
import { CategoryPerformance } from '../../../components/reports/CategoryPerformance';
import { ProductivitySection } from '../../../components/reports/ProductivitySection';
import { StreakSection } from '../../../components/reports/StreakSection';
import { ExportMenu } from '../../../components/reports/ExportMenu';
import { Loader2 } from 'lucide-react';
import type { AnyReportDTO } from '../../../../../server/src/modules/reports/reports.types';

interface Props {
  type: 'weekly' | 'monthly' | 'yearly';
}

export const ReportViewer = ({ type }: Props) => {
  const weekly = useWeeklyReport();
  const monthly = useMonthlyReport();
  const yearly = useYearlyReport();

  let query: any;
  if (type === 'weekly') query = weekly;
  else if (type === 'monthly') query = monthly;
  else query = yearly;

  const { data, isLoading, isError, error } = query;
  const report: AnyReportDTO = data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm uppercase tracking-widest">Generating {type} report...</p>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-red-400">
        <p>Failed to load report.</p>
        <p className="text-sm mt-2 opacity-80">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-thin capitalize">{type} Report</h2>
          <p className="text-sm text-muted-foreground mt-2">Generated on {new Date(report.generatedAt).toLocaleDateString()}</p>
        </div>
        <ExportMenu type={type} />
      </div>

      <ExecutiveSummary summary={report.summary} />
      <ProductivitySection data={report.productivity} />
      <StreakSection data={report.streaks} />
      <CategoryPerformance data={report.categoryPerformance} />
      
      {/* We can add Insights and Timeline here in the future as per Phase 7 & 9 requirements */}
    </div>
  );
};
