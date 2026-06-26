import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  weekStart: string;
  preferences: {
    theme: string;
    notificationsEnabled: boolean;
    language: string;
    dashboardLayout: string;
    reducedMotion: boolean;
    compactMode: boolean;
  };
  statistics?: {
    totalHabits: number;
    longestStreak: number;
    currentStreak: number;
    achievementsCount: number;
  };
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  accessToken: string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Initially loading while we check session
  accessToken: null,
  setAuth: (user, accessToken) => set({ user, isAuthenticated: true, accessToken, isLoading: false }),
  updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
  logout: () => set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
