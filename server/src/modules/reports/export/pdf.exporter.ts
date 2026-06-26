import { AnyReportDTO } from '../reports.types';
import PDFDocument from 'pdfkit';

export class PdfExporter {
  static async generate(report: AnyReportDTO): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Document styling and structure
        doc.fontSize(24).font('Helvetica-Bold').text('HabitFlow AI Report', { align: 'center' });
        doc.moveDown(1.5);

        doc.fontSize(14).font('Helvetica').text(`Report Type: ${report.type.toUpperCase()}`);
        doc.text(`Generated On: ${new Date(report.generatedAt).toLocaleDateString()}`);
        doc.moveDown(2);

        doc.fontSize(18).font('Helvetica-Bold').text('Executive Summary');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Overall Productivity: ${report.summary.overallProductivity}%`);
        doc.text(`Consistency: ${report.summary.consistencyScore}%`);
        doc.text(`Habits Completed: ${report.summary.totalHabitsCompleted}`);
        doc.text(`XP Earned: ${report.summary.xpEarned}`);
        doc.moveDown(2);

        doc.fontSize(18).font('Helvetica-Bold').text('Streaks');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        doc.fontSize(12).font('Helvetica');
        doc.text(`Current Streak: ${report.streaks.currentStreak} Days`);
        doc.text(`All-Time Best: ${report.streaks.bestStreak} Days`);
        doc.text(`Momentum Trend: ${report.streaks.trend.toUpperCase()}`);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
