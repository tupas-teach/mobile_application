import { useAuthStore } from '../store/authStore';

/**
 * useAuth — thin wrapper around authStore.
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
