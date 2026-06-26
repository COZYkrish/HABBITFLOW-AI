import { AnyReportDTO } from '../reports.types';

export class JsonExporter {
  static generate(report: AnyReportDTO): string {
    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      report,
    }, null, 2);
  }
}
