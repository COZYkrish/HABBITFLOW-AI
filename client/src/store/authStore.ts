import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  preferences: {
    theme: string;
    notificationsEnabled: boolean;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
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
  logout: () => set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
