import { ReportProductivityDTO } from '../reports.types';

export class ProductivityEngine {
  static calculate(logs: any[], totalHabitsCount: number, daysInPeriod: number): ReportProductivityDTO {
    const completed = logs.filter((l) => l.completed).length;
    const maxPossible = totalHabitsCount * daysInPeriod;
    const overallScore = maxPossible > 0 ? Math.round((completed / maxPossible) * 100) : 0;
    
    // Simplistic calculations for now (would be more complex in real implementation)
    const consistency = overallScore;
    const completion = overallScore;
    const momentum = Math.min(100, overallScore + 10);
    const routineStability = Math.min(100, overallScore + 5);

    return {
      overallScore,
      consistency,
      completion,
      momentum,
      routineStability,
    };
  }
}
