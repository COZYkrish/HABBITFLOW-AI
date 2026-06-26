import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../../../api/profile.service';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Bell, BellOff } from 'lucide-react';

export const NotificationSettings = () => {
  const { user, updateUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notificationsEnabled ?? true
  );

  const handleToggle = () => {
    setNotificationsEnabled(prev => !prev);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const data = await profileApi.updatePreferences({
        notificationsEnabled,
      });
      updateUser(data as any);
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = notificationsEnabled !== user?.preferences?.notificationsEnabled;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Notifications</h1>
        <p className="text-text-secondary">Choose how you want to be reminded about your habits.</p>
      </div>

      <section className="space-y-6">
        <div className="flex items-start justify-between p-6 rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${notificationsEnabled ? 'bg-primary/10 text-primary' : 'bg-foreground/10 text-text-secondary'}`}>
              {notificationsEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-1">Push Notifications</h3>
              <p className="text-sm text-text-secondary">Receive alerts for reminders and daily summaries.</p>
            </div>
          </div>
          <button 
            onClick={handleToggle}
            className={`w-14 h-7 rounded-full transition-colors relative shrink-0 ${notificationsEnabled ? 'bg-primary' : 'bg-foreground/20'}`}
          >
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${notificationsEnabled ? 'left-8' : 'left-1'}`} />
          </button>
        </div>
      </section>

      {/* Placeholders for Phase 10 integration details */}
      <section className="opacity-50 pointer-events-none">
        <h3 className="text-lg font-medium mb-4">Detailed Preferences (Coming soon)</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
            <div>
              <h4 className="font-medium">Morning Summary</h4>
              <p className="text-sm">Get an overview of your day at 8:00 AM</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-foreground/20 relative">
              <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
            <div>
              <h4 className="font-medium">Quiet Hours</h4>
              <p className="text-sm">Mute all notifications between 10 PM and 7 AM</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-foreground/20 relative">
              <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8 border-t border-border flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
