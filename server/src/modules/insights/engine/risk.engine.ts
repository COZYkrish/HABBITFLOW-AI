import { IHabit } from '../../habit/models/Habit';
import { IHabitLog } from '../../habit/models/HabitLog';
import { RiskRules } from '../rules/risk.rules';
import { RiskAssessmentDTO } from '../dto/insights.dto';
import { randomUUID as uuidv4 } from 'crypto';

export class RiskEngine {
  static analyze(habits: IHabit[], recentLogs: IHabitLog[]): RiskAssessmentDTO | null {
    if (habits.length === 0) return null;

    // Group logs by habit
    const logsByHabit = new Map<string, IHabitLog[]>();
    recentLogs.forEach(log => {
      const hId = log.habitId.toString();
      if (!logsByHabit.has(hId)) logsByHabit.set(hId, []);
      logsByHabit.get(hId)!.push(log);
    });

    const todayDate = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgoDate = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

    const highestRisks: ReturnType<typeof RiskRules.evaluateStreakRisk>[] = [];

    for (const habit of habits) {
      const hLogs = logsByHabit.get(habit._id.toString()) || [];
      const todayLog = hLogs.find(l => l.date === todayDate);
      const yesterdayLog = hLogs.find(l => l.date === yesterdayDate);
      const twoDaysAgoLog = hLogs.find(l => l.date === twoDaysAgoDate);

      // If already completed today, no risk for today.
      if (todayLog?.completed) continue;

      let missedDays = 0;
      if (yesterdayLog && !yesterdayLog.completed) missedDays++;
      if (missedDays > 0 && twoDaysAgoLog && !twoDaysAgoLog.completed) missedDays++;
      if (!yesterdayLog) missedDays++; // implicitly missed if no log (assuming habit was created before yesterday)

      // simplified current streak
      const currentStreak = habit.statistics?.currentStreak || 0;
      if ((habit.statistics?.currentStreak || 0) >= 7 && missedDays > 0) {
        const risk = RiskRules.evaluateStreakRisk(missedDays, habit.title, currentStreak);
        if (risk) highestRisks.push(risk);
      }
    }

    if (highestRisks.length === 0) return null;

    // Pick highest severity
    highestRisks.sort((a, b) => {
      if (a!.severity === 'critical' && b!.severity !== 'critical') return -1;
      if (b!.severity === 'critical' && a!.severity !== 'critical') return 1;
      return 0;
    });

    const bestRule = highestRisks[0]!;
    let riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' = 'Low Risk';
    if (bestRule.severity === 'critical') riskLevel = 'High Risk';
    if (bestRule.severity === 'high') riskLevel = 'Medium Risk';

    return {
      id: uuidv4(),
      category: 'risk',
      title: bestRule.title,
      description: bestRule.description,
      severity: bestRule.severity,
      priority: bestRule.severity === 'critical' ? 5 : 4,
      confidence: bestRule.confidence,
      recommendation: bestRule.recommendation,
      evidence: bestRule.evidence,
      riskLevel,
      affectedHabits: highestRisks.map(r => (r!.evidence.find(e => e.metric === 'Habit at Risk')?.value as string)),
      createdAt: new Date().toISOString()
    };
  }
}
