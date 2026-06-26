import { NotificationPreferences, INotificationPreferences } from '../models/NotificationPreferences';
import { NotificationPreferencesDTO } from '../notifications.types';

export class PreferenceEngine {
  static async getPreferences(userId: string): Promise<INotificationPreferences> {
    let prefs = await NotificationPreferences.findOne({ userId });
    if (!prefs) {
      prefs = await NotificationPreferences.create({ userId });
    }
    return prefs;
  }

  static async updatePreferences(userId: string, updates: Partial<NotificationPreferencesDTO>): Promise<INotificationPreferences> {
    const prefs = await NotificationPreferences.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true }
    );
    return prefs;
  }

  static isQuietHours(prefs: INotificationPreferences, date: Date = new Date()): boolean {
    if (!prefs.quietHoursEnabled) return false;

    // A simple quiet hours check assuming same timezone 
    // and format "HH:mm"
    const nowHour = date.getHours();
    const nowMin = date.getMinutes();
    const current = nowHour * 60 + nowMin;

    const [startH, startM] = prefs.quietHoursStart.split(':').map(Number);
    const start = startH * 60 + startM;

    const [endH, endM] = prefs.quietHoursEnd.split(':').map(Number);
    const end = endH * 60 + endM;

    if (start < end) {
      return current >= start && current < end;
    } else {
      // Over midnight (e.g. 22:00 to 07:00)
      return current >= start || current < end;
    }
  }
}
