import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
import { PdfExporter } from './export/pdf.exporter';
import { CsvExporter } from './export/csv.exporter';
import { JsonExporter } from './export/json.exporter';

export class ReportsController {
  static async getWeekly(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const timezone = req.headers['x-timezone'] as string || 'UTC';
      const data = await ReportsService.getWeeklyReport(userId, timezone);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async getMonthly(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const timezone = req.headers['x-timezone'] as string || 'UTC';
      const data = await ReportsService.getMonthlyReport(userId, timezone);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async getYearly(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const timezone = req.headers['x-timezone'] as string || 'UTC';
      const data = await ReportsService.getYearlyReport(userId, timezone);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async exportPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body; // 'weekly' | 'monthly' | 'yearly'
      const userId = (req as any).user.id;
      const timezone = req.headers['x-timezone'] as string || 'UTC';
      
      let report;
      if (type === 'monthly') report = await ReportsService.getMonthlyReport(userId, timezone);
      else if (type === 'yearly') report = await ReportsService.getYearlyReport(userId, timezone);
      else report = await ReportsService.getWeeklyReport(userId, timezone);

      const pdfBuffer = await PdfExporter.generate(report);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=habitflow-${type}-report.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async exportCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body;
      const userId = (req as any).userId;
      const timezone = req.headers['x-timezone'] as string || 'UTC';
      
      let report;
      if (type === 'monthly') report = await ReportsService.getMonthlyReport(userId, timezone);
      else if (type === 'yearly') report = await ReportsService.getYearlyReport(userId, timezone);
      else report = await ReportsService.getWeeklyReport(userId, timezone);

      const csvString = CsvExporter.generate(report);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=habitflow-${type}-report.csv`);
      res.send(csvString);
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }

  static async exportJson(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body;
      const userId = (req as any).userId;
      const timezone = req.headers['x-timezone'] as string || 'UTC';
      
      let report;
      if (type === 'monthly') report = await ReportsService.getMonthlyReport(userId, timezone);
      else if (type === 'yearly') report = await ReportsService.getYearlyReport(userId, timezone);
      else report = await ReportsService.getWeeklyReport(userId, timezone);

      const jsonString = JsonExporter.generate(report);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=habitflow-${type}-report.json`);
      res.send(jsonString);
    } catch (error: any) {
      next({ message: error.message, statusCode: 500 });
    }
  }
}
