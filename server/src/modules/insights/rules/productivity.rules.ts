import { ProductivityScoreDTO } from '../dto/insights.dto';

export class ProductivityRules {
  static calculateScore(
    consistencyScore: number,
    completionScore: number,
    momentumScore: number,
    routineStability: number,
    timeEfficiency: number
  ): ProductivityScoreDTO {
    // Weighted overall score
    const overallScore = 
      (consistencyScore * 0.3) +
      (completionScore * 0.3) +
      (momentumScore * 0.2) +
      (routineStability * 0.1) +
      (timeEfficiency * 0.1);

    let reasoning = '';
    if (overallScore > 85) reasoning = 'Outstanding productivity. Your routine is highly stable and consistent.';
    else if (overallScore > 70) reasoning = 'Good productivity. You are maintaining a solid momentum.';
    else if (overallScore > 50) reasoning = 'Average productivity. There is room for better consistency.';
    else reasoning = 'Low productivity. Consider focusing on just 1 or 2 core habits to build momentum.';

    return {
      overallScore: Math.round(overallScore),
      consistencyScore: Math.round(consistencyScore),
      completionScore: Math.round(completionScore),
      momentumScore: Math.round(momentumScore),
      routineStability: Math.round(routineStability),
      timeEfficiency: Math.round(timeEfficiency),
      reasoning
    };
  }
}
