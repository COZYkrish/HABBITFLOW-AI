import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Laptop, Smartphone, Globe, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { profileApi } from '../../api/profile.service';
import type { SessionResponse } from '../../api/profile.service';
import toast from 'react-hot-toast';

export const SessionManager = () => {
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await profileApi.getActiveSessions();
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load active sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (sessionId: string) => {
    try {
      setRevokingId(sessionId);
      await profileApi.revokeSession(sessionId);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      toast.success('Session revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke session');
    } finally {
      setRevokingId(null);
    }
  };

  const getDeviceIcon = (device?: string) => {
    if (device?.toLowerCase().includes('mobile') || device?.toLowerCase().includes('iphone') || device?.toLowerCase().includes('android')) return Smartphone;
    if (device?.toLowerCase().includes('desktop') || device?.toLowerCase().includes('mac') || device?.toLowerCase().includes('windows')) return Laptop;
    return Globe;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No active sessions found.</p>
      ) : (
        sessions.map((session, index) => {
          const Icon = getDeviceIcon(session.device || session.os);
          const isCurrent = index === 0;

          return (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/[0.02] hover:bg-foreground/[0.04] transition"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isCurrent ? 'bg-primary/10 text-primary' : 'bg-foreground/10 text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{session.os || 'Unknown Device'}</h4>
                    {isCurrent && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session.browser || 'Unknown Browser'} • {session.ip || 'Unknown IP'} • Last active: {new Date(session.lastActivity).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {!isCurrent && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => handleRevoke(session._id)}
                  disabled={revokingId === session._id}
                >
                  {revokingId === session._id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 mr-2" />
                  )}
                  Revoke
                </Button>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
};
