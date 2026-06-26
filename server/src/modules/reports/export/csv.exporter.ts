import { AnyReportDTO } from '../reports.types';

export class CsvExporter {
  static generate(report: AnyReportDTO): string {
    const lines = [
      'Category,Completion Rate (%),Time Invested (mins)',
    ];

    report.categoryPerformance.forEach((cat) => {
      lines.push(`${cat.category},${cat.completionRate},${cat.timeInvested}`);
    });

    lines.push('', 'Summary', `Score,${report.summary.overallProductivity}`);
    
    return lines.join('\n');
  }
}
