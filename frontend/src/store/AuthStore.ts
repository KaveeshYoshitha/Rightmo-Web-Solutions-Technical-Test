import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/User';
import { api } from '../services/api';
import axios from 'axios';

type ApiErrorResponse = {
  message?: string;
};

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;

  bootstrap: () => Promise<void>;
  register: (payload: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: 'idle',
      error: null,

      clearError: () => set({ error: null }),

      bootstrap: async () => {
        const { status } = get();
        if (status === 'loading') return;

        set({ status: 'loading', error: null });
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.user, status: 'authenticated' });
        } catch {
          set({ user: null, status: 'unauthenticated' });
        }
      },

      register: async ({ username, email, password }) => {
        set({ status: 'loading', error: null });
        try {
          await api.post('/auth/register', { username, email, password });
          // After registering, require explicit login (backend does not auto-login).
          set({ status: 'unauthenticated' });
        } catch (err: unknown) {
          const message = axios.isAxiosError<ApiErrorResponse>(err)
            ? err.response?.data?.message
            : undefined;
          set({
            status: 'unauthenticated',
            error: message ?? 'Registration failed',
          });
          throw err;
        }
      },

      login: async ({ email, password }) => {
        set({ status: 'loading', error: null });
        try {
          const res = await api.post('/auth/login', { email, password });
          set({ user: res.data.user, status: 'authenticated' });
        } catch (err: unknown) {
          const message = axios.isAxiosError<ApiErrorResponse>(err)
            ? err.response?.data?.message
            : undefined;
          set({
            user: null,
            status: 'unauthenticated',
            error: message ?? 'Login failed',
          });
          throw err;
        }
      },

      logout: async () => {
        set({ status: 'loading', error: null });
        try {
          await api.post('/auth/logout');
        } finally {
          set({ user: null, status: 'unauthenticated' });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, status: state.status }),
    },
  ),
);
