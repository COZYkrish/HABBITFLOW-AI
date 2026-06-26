import { IHabitLog } from '../../habit/models/HabitLog';
import { ScheduleRules } from '../rules/schedule.rules';
import { ScheduleInsightDTO } from '../dto/insights.dto';
import { randomUUID as uuidv4 } from 'crypto';

export class ScheduleEngine {
  static analyze(logs: IHabitLog[]): ScheduleInsightDTO | null {
    const completedLogs = logs.filter(l => l.completed);
    if (completedLogs.length === 0) return null;

    const timeOfDayStats = {
      Morning: 0,
      Afternoon: 0,
      Evening: 0,
      Night: 0
    };

    const weekdayStats: Record<string, number> = {
      Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0
    };
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    completedLogs.forEach(log => {
      // Best time of day requires completedAt
      if (log.completionTime) {
        const date = new Date(log.completionTime);
        const hour = date.getHours(); // Local server time, can be improved with user tz
        if (hour >= 5 && hour < 12) timeOfDayStats.Morning++;
        else if (hour >= 12 && hour < 17) timeOfDayStats.Afternoon++;
        else if (hour >= 17 && hour < 21) timeOfDayStats.Evening++;
        else timeOfDayStats.Night++;
      }
      
      const dayIndex = new Date(log.date).getUTCDay();
      weekdayStats[weekdays[dayIndex]]++;
    });

    const timeRule = ScheduleRules.evaluateBestTimeOfDay(timeOfDayStats, completedLogs.length);
    const dayRule = ScheduleRules.evaluateBestWeekday(weekdayStats, completedLogs.length);

    if (!timeRule && !dayRule) return null;

    // Combine them or pick the most confident one
    const bestRule = (timeRule?.confidence || 0) > (dayRule?.confidence || 0) ? timeRule : dayRule;
    if (!bestRule) return null;

    // Parse best day
    let mostProductiveWeekday = 'Unknown';
    let leastProductiveWeekday = 'Unknown';
    let bestTimeOfDay: any = 'Unknown';

    if (dayRule) {
      mostProductiveWeekday = dayRule.evidence[0].value as string;
      leastProductiveWeekday = dayRule.evidence[1].value as string;
    }
    if (timeRule) {
      bestTimeOfDay = timeRule.description.split('the ')[1].replace('.', '');
    }

    return {
      id: uuidv4(),
      category: 'schedule',
      title: bestRule.title,
      description: bestRule.description,
      severity: bestRule.severity,
      priority: 2,
      confidence: bestRule.confidence,
      recommendation: bestRule.recommendation,
      evidence: bestRule.evidence,
      bestTimeOfDay,
      mostProductiveWeekday,
      leastProductiveWeekday,
      createdAt: new Date().toISOString()
    };
  }
}
