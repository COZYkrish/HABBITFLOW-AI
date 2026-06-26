import { useEffect, useState, useCallback, useRef } from 'react';
import { useUpcomingNotifications } from './useNotifications';
import { notificationsApi } from '../api/notifications.service';

export const useWebNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { upcoming, refetch } = useUpcomingNotifications();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    // Initialize sound
    audioRef.current = new Audio('/notification.mp3');
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Autoplay policy might block it
      });
    }
  }, []);

  // Poll for upcoming notifications and trigger them
  useEffect(() => {
    if (permission !== 'granted') return;

    const now = new Date().getTime();
    
    upcoming.forEach(async (notif) => {
      const scheduledTime = new Date(notif.scheduledAt).getTime();
      
      // If it's due now or in the past (and wasn't processed yet)
      if (scheduledTime <= now) {
        // Fire browser notification
        const n = new Notification(notif.title, {
          body: notif.body,
          icon: '/icon-192.png',
          tag: notif._id, // Prevent duplicate triggers
        });

        playSound();

        // Mark it as dispatched on backend
        await notificationsApi.markDispatched({
          queueId: notif._id,
          type: notif.type,
          title: notif.title,
          body: notif.body,
          icon: notif.icon,
          data: notif.data
        });

        // Refetch to clear it from upcoming
        refetch();

        n.onclick = () => {
          window.focus();
          n.close();
        };
      }
    });
  }, [upcoming, permission, refetch, playSound]);

  const testNotification = async () => {
    if (permission !== 'granted') return;
    await notificationsApi.testNotification();
    refetch(); // force fetch to immediately get it
  };

  return {
    permission,
    requestPermission,
    testNotification,
  };
};
