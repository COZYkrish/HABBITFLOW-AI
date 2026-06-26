import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, type NotificationPreferencesDTO } from '../api/notifications.service';

export const useNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: notificationsApi.getPreferences,
  });

  const mutation = useMutation({
    mutationFn: (updates: Partial<NotificationPreferencesDTO>) => notificationsApi.updatePreferences(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
  });

  return {
    preferences: query.data,
    isLoading: query.isLoading,
    updatePreferences: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};

export const useNotificationHistory = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notificationHistory'],
    queryFn: notificationsApi.getHistory,
    refetchInterval: 60000, // refresh every minute
  });

  const markRead = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notificationHistory'] }),
  });

  return {
    history: query.data || [],
    isLoading: query.isLoading,
    markRead: markRead.mutate,
  };
};

export const useUpcomingNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['upcomingNotifications'],
    queryFn: notificationsApi.getUpcoming,
    refetchInterval: 30000, // refresh every 30s to trigger notifications
  });

  const snooze = useMutation({
    mutationFn: ({ historyId, queueId, minutes }: { historyId: string, queueId?: string, minutes: number }) => 
      notificationsApi.snooze(historyId, queueId, minutes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upcomingNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationHistory'] });
    }
  });

  return {
    upcoming: query.data || [],
    isLoading: query.isLoading,
    snooze: snooze.mutate,
    refetch: query.refetch,
  };
};
