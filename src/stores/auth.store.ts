import { create } from 'zustand';
import type { User } from '@/types';
import { secureStorage } from '@/services/storage/secure';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  setUser: (user) => {
    set({ user, isAuthenticated: user !== null });
  },

  setToken: async (token) => {
    if (token) {
      await secureStorage.setToken(token);
      set({ token, isAuthenticated: true });
    } else {
      await secureStorage.clearToken();
      set({ token: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    await secureStorage.clearAll();
    set({ isAuthenticated: false, user: null, token: null });
  },
}));
