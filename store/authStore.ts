import type { MembershipTier, User } from '@/types';
import { create } from 'zustand';

export type { MembershipTier, User };

interface AuthState {
  user:            User | null;
  token:           string | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  error:           string | null;
  login:           (email: string, password: string) => Promise<void>;
  register:        (name: string, email: string, password: string) => Promise<void>;
  logout:          () => void;
  setUser:         (user: User) => void;
  clearError:      () => void;
  restoreSession:  () => Promise<void>;
}

const MOCK_USER: User = {
  id: '1',
  name: 'Juan Dela Cruz',
  email: 'juan@email.com',
  membership: 'premium',
  joinedAt: '2024-01-15',
  points: 1250,
};

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  token:           null,
  isLoading:       false,
  isAuthenticated: false,
  error:           null,

  login: async (_email: string, _password: string) => {
    set({ isLoading: true, error: null });
    await new Promise<void>((r) => setTimeout(r, 1200));
    set({
      user: MOCK_USER,
      token: 'mock-jwt-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true, error: null });
    await new Promise<void>((r) => setTimeout(r, 1200));
    set({
      user: { ...MOCK_USER, name, email, membership: 'basic', points: 0 },
      token: 'mock-jwt-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  setUser: (user: User) => set({ user, isAuthenticated: true }),

  clearError: () => set({ error: null }),

  restoreSession: async () => {
    // Checks for a persisted session on app launch.
    // Replace the mock below with your real Supabase call:
    //   const { data: { session } } = await supabase.auth.getSession();
    //   if (session?.user) set({ user: ..., isAuthenticated: true });
    set({ isLoading: true });
    await new Promise<void>((r) => setTimeout(r, 500));
    set({ isLoading: false });
  },
}));
