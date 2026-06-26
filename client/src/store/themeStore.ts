import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        
        // Sync to backend if token exists
        const token = localStorage.getItem('auth-storage');
        if (token && token.includes('accessToken')) {
          import('../api/profile.service').then(({ profileApi }) => {
            profileApi.updatePreferences({ theme }).catch(console.error);
          });
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
