import { API_BASE } from '@/lib/config';
import type { MembershipTier, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type { MembershipTier, User };

interface AuthState {
  user:            User | null;
  token:           string | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  error:           string | null;

  login:          (email: string, password: string) => Promise<void>;
  register:       (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout:         () => void;
  setUser:        (user: User) => void;
  clearError:     () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user:            null,
  token:           null,
  isLoading:       false,
  isAuthenticated: false,
  error:           null,

  // ── Login ──────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');

      await AsyncStorage.setItem('flexzone_token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: any) {
      set({ error: err.message ?? 'Login failed.', isLoading: false });
      throw err;
    }
  },

  // ── Register ───────────────────────────────────────────────────────────────
  register: async (name, email, password, phone) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify({
          name,
          email,
          password,
          password_confirmation: password,
          phone: phone ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.errors
          ? Object.values(data.errors).flat().join('\n')
          : data.message || 'Registration failed.';
        throw new Error(msg);
      }

      await AsyncStorage.setItem('flexzone_token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: any) {
      set({ error: err.message ?? 'Registration failed.', isLoading: false });
      throw err;
    }
  },

  // ── Logout ─────────────────────────────────────────────────────────────────
  logout: () => {
    const { token } = get();
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json' },
      }).catch(() => {});
    }
    AsyncStorage.removeItem('flexzone_token').catch(() => {});
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  // ── setUser ────────────────────────────────────────────────────────────────
  setUser: (user) => set({ user, isAuthenticated: true }),

  // ── clearError ─────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),

  // ── restoreSession ─────────────────────────────────────────────────────────
  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('flexzone_token');
      if (!token) { set({ isLoading: false }); return; }

      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json' },
      });

      if (res.ok) {
        const user = await res.json();
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        await AsyncStorage.removeItem('flexzone_token');
        set({ isLoading: false });
      }
    } catch {
      await AsyncStorage.removeItem('flexzone_token');
      set({ isLoading: false });
    }
  },
}));