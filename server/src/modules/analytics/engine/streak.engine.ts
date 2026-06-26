import { StreakDTO } from '../dto/analytics.dto';

export class StreakEngine {
  static calculateStreaks(completedDates: string[], todayString: string, yesterdayString: string): StreakDTO {
    if (completedDates.length === 0) {
      return { currentStreak: 0, bestStreak: 0, history: [] };
    }

    // Ensure sorted and unique dates
    const dates = [...new Set(completedDates)].sort();
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;
    const history: { startDate: string; endDate: string; length: number }[] = [];
    
    let streakStart = dates[0];
    let streakEnd = dates[0];

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        streakEnd = dates[i];
      } else {
        history.push({ startDate: streakStart, endDate: streakEnd, length: tempStreak });
        if (tempStreak > bestStreak) bestStreak = tempStreak;
        tempStreak = 1;
        streakStart = dates[i];
        streakEnd = dates[i];
      }
    }
    // push the last streak
    history.push({ startDate: streakStart, endDate: streakEnd, length: tempStreak });
    if (tempStreak > bestStreak) bestStreak = tempStreak;

    // Check if the current streak is still active
    const lastDate = dates[dates.length - 1];
    if (lastDate === todayString || lastDate === yesterdayString) {
      currentStreak = tempStreak;
    }

    return { currentStreak, bestStreak, history };
  }
}
