import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../../../api/profile.service';
import { useThemeStore } from '../../../store/themeStore';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Monitor, Moon, Sun } from 'lucide-react';

export const AppearanceSettings = () => {
  const { user, updateUser } = useAuthStore();
  const { setTheme } = useThemeStore();
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || 'system',
    dashboardLayout: user?.preferences?.dashboardLayout || 'default',
    reducedMotion: user?.preferences?.reducedMotion || false,
    compactMode: user?.preferences?.compactMode || false,
  });

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setPreferences(prev => ({ ...prev, theme: newTheme }));
  };

  const handleToggle = (field: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const data = await profileApi.updatePreferences({
        theme: preferences.theme as 'light' | 'dark' | 'system',
        dashboardLayout: preferences.dashboardLayout as string,
        reducedMotion: preferences.reducedMotion as boolean,
        compactMode: preferences.compactMode as boolean,
      });
      updateUser(data as any);
      toast.success('Appearance settings saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const;

  const hasChanges = 
    preferences.theme !== user?.preferences?.theme ||
    preferences.dashboardLayout !== user?.preferences?.dashboardLayout ||
    preferences.reducedMotion !== user?.preferences?.reducedMotion ||
    preferences.compactMode !== user?.preferences?.compactMode;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Appearance</h1>
        <p className="text-text-secondary">Customize how HabitFlow AI looks on your device.</p>
      </div>

      <section>
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleThemeChange(id)}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                preferences.theme === id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border bg-surface hover:bg-foreground/5 text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-8 h-8 mb-3" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6 pt-8 border-t border-border">
        <h3 className="text-lg font-medium mb-4">Display Preferences</h3>
        
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
          <div>
            <h4 className="font-medium text-text-primary">Compact Mode</h4>
            <p className="text-sm text-text-secondary mt-1">Reduce spacing and padding across the interface</p>
          </div>
          <button 
            onClick={() => handleToggle('compactMode')}
            className={`w-12 h-6 rounded-full transition-colors relative ${preferences.compactMode ? 'bg-primary' : 'bg-foreground/20'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${preferences.compactMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
          <div>
            <h4 className="font-medium text-text-primary">Reduced Motion</h4>
            <p className="text-sm text-text-secondary mt-1">Minimize animations and page transitions</p>
          </div>
          <button 
            onClick={() => handleToggle('reducedMotion')}
            className={`w-12 h-6 rounded-full transition-colors relative ${preferences.reducedMotion ? 'bg-primary' : 'bg-foreground/20'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${preferences.reducedMotion ? 'left-7' : 'left-1'}`} />
          </button>
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

export default AppearanceSettings;
