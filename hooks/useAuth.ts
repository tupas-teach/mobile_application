import { useAuthStore } from '../store/authStore';

/**
 * useAuth — thin wrapper around authStore.
 * Screens import this; the store does the actual Supabase calls.
 */
export function useAuth() {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    clearError,
    restoreSession,
  } = useAuthStore();

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    clearError,
    restoreSession,
  };
}
