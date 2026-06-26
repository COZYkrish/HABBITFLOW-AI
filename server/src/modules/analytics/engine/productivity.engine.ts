import { ProductivityDTO } from '../dto/analytics.dto';
import { AnalyticsEngine } from './analytics.engine';

export class ProductivityEngine {
  static calculateProductivity(
    totalExpectedHabits: number, 
    completedHabits: number, 
    expectedDuration: number, 
    actualDuration: number
  ): ProductivityDTO {
    const completionScore = AnalyticsEngine.calculatePercentage(completedHabits, totalExpectedHabits);
    
    // Time efficiency: how much of the expected time was actually invested. 
    // If actual > expected, cap at 100%. If expected is 0, default to 100% or 0 based on actual.
    let timeEfficiency = 0;
    if (expectedDuration > 0) {
      timeEfficiency = AnalyticsEngine.calculatePercentage(actualDuration, expectedDuration);
      if (timeEfficiency > 100) timeEfficiency = 100;
    } else if (actualDuration > 0) {
      timeEfficiency = 100;
    }

    // Consistency score is a bit more complex, we'll approximate it here as equal to completionScore
    // In a real scenario, this would look at daily variations over a period.
    const consistencyScore = completionScore; 

    // Overall productivity is a weighted average
    const overallProductivity = Math.round((completionScore * 0.6) + (timeEfficiency * 0.4));

    return {
      consistencyScore,
      completionScore,
      timeEfficiency,
      overallProductivity
    };
  }
}
