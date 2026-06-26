import { motion } from 'framer-motion';
import { pageTransitionVariants } from '../../animations/variants';
import { useNotificationPreferences } from '../../hooks/useNotifications';
import { useWebNotifications as useBrowserNotifs } from '../../hooks/useWebNotifications';
import { NotificationHistory } from '../../components/notifications/NotificationHistory';
import { Bell, Clock, Sun, Moon, Volume2 } from 'lucide-react';
import { PermissionBanner } from '../../components/notifications/PermissionBanner';

const NotificationsPage = () => {
  const { preferences, updatePreferences, isLoading } = useNotificationPreferences();
  const { testNotification } = useBrowserNotifs();

  if (isLoading || !preferences) {
    return <div className="p-8 text-center text-muted-foreground">Loading preferences...</div>;
  }

  const toggle = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl font-light tracking-wide mb-2 uppercase">Reminder Preferences</h1>
        <p className="text-muted-foreground">Configure your consistency engine and view notification history.</p>
      </header>

      <PermissionBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Settings Column */}
        <div className="space-y-6">
          <section className="glass-card p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Core Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-xl">
                <div>
                  <h3 className="font-medium">Enable All Reminders</h3>
                  <p className="text-xs text-muted-foreground">Master switch for all HabitFlow notifications</p>
                </div>
                <button 
                  onClick={() => toggle('enabled')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${preferences.enabled ? 'bg-primary' : 'bg-foreground/20'}`}
                >
                  <motion.div 
                    layout 
                    className="w-5 h-5 bg-background rounded-full absolute top-0.5" 
                    initial={false}
                    animate={{ left: preferences.enabled ? 'calc(100% - 22px)' : '2px' }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-xl opacity-50 cursor-not-allowed">
                <div>
                  <h3 className="font-medium">Notification Sound</h3>
                  <p className="text-xs text-muted-foreground">Play a soft chime when reminding</p>
                </div>
                <Volume2 className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <button 
                onClick={testNotification}
                className="w-full p-4 border border-dashed border-primary/50 text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors"
              >
                Send Test Notification
              </button>
            </div>
          </section>

          <section className="glass-card p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Daily & Weekly Summaries
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-xl">
                <div>
                  <h3 className="font-medium flex items-center gap-2"><Sun className="w-4 h-4" /> Morning Summary</h3>
                  <p className="text-xs text-muted-foreground">Get a plan for your day at {preferences.morningSummaryTime}</p>
                </div>
                <button 
                  onClick={() => toggle('morningSummary')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${preferences.morningSummary ? 'bg-primary' : 'bg-foreground/20'}`}
                >
                  <motion.div 
                    layout 
                    className="w-5 h-5 bg-background rounded-full absolute top-0.5" 
                    initial={false}
                    animate={{ left: preferences.morningSummary ? 'calc(100% - 22px)' : '2px' }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-xl">
                <div>
                  <h3 className="font-medium flex items-center gap-2"><Moon className="w-4 h-4" /> Evening Summary</h3>
                  <p className="text-xs text-muted-foreground">Review your progress at {preferences.eveningSummaryTime}</p>
                </div>
                <button 
                  onClick={() => toggle('eveningSummary')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${preferences.eveningSummary ? 'bg-primary' : 'bg-foreground/20'}`}
                >
                  <motion.div 
                    layout 
                    className="w-5 h-5 bg-background rounded-full absolute top-0.5" 
                    initial={false}
                    animate={{ left: preferences.eveningSummary ? 'calc(100% - 22px)' : '2px' }}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* History Column */}
        <div className="space-y-6">
          <section className="glass-card p-6 rounded-2xl border border-border h-full">
            <h2 className="text-xl font-medium mb-6">Notification History</h2>
            <NotificationHistory />
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsPage;
