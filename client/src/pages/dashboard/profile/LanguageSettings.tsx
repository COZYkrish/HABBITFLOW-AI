import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../../../api/profile.service';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const LanguageSettings = () => {
  const { user, updateUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekStart: user?.weekStart || 'Monday',
    language: user?.preferences?.language || 'en',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      // Update profile fields
      await profileApi.updateProfile({
        timezone: formData.timezone,
        weekStart: formData.weekStart as 'Sunday' | 'Monday',
      });
      // Update preference fields
      const prefData = await profileApi.updatePreferences({
        language: formData.language,
      });
      
      updateUser(prefData as any);
      toast.success('Language and region settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = 
    formData.timezone !== user?.timezone ||
    formData.weekStart !== user?.weekStart ||
    formData.language !== user?.preferences?.language;

  // Simple timezone list for Phase 11
  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Kolkata',
    'Australia/Sydney',
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ];
  
  // Remove duplicates
  const uniqueTimezones = Array.from(new Set(timezones)).sort();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Language & Region</h1>
        <p className="text-text-secondary">Customize your timezone, calendar and locale settings.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">Region Settings</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Timezone</label>
            <select 
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
            >
              {uniqueTimezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <p className="text-xs text-text-secondary">Used for sending reminders and generating daily reports at the right time.</p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-text-primary">Week Starts On</label>
            <select 
              name="weekStart"
              value={formData.weekStart}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
            >
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <p className="text-xs text-text-secondary">Affects calendar views and weekly statistics.</p>
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-lg font-medium text-text-primary">Language</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Interface Language</label>
            <select 
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
            >
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
            <p className="text-xs text-text-secondary">Additional languages are coming in future updates.</p>
          </div>
        </section>

        <div className="pt-8 border-t border-border flex justify-end">
          <Button type="submit" disabled={isSaving || !hasChanges}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default LanguageSettings;
