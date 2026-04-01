import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { secureStorage } from '@/services/storage/secure';
import { fetchProfile } from '@/services/api/user';
import { apiClient, USE_REAL_BACKEND } from '@/services/api/client';

export function useAuth() {
  const { isAuthenticated, user, setUser, setToken, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate auth state on mount - check for existing token
  useEffect(() => {
    async function hydrate() {
      try {
        const token = await secureStorage.getToken();
        if (token) {
          await setToken(token);
          const profile = await fetchProfile();
          setUser(profile);
        }
      } catch {
        // Token invalid or expired - clear it
        await storeLogout();
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await apiClient.post<{ token: string; refreshToken: string }>(
          '/auth-login',
          { email, password },
        );

        const { token, refreshToken } = response.data;
        await setToken(token);
        await secureStorage.setRefreshToken(refreshToken);

        const profile = await fetchProfile();
        setUser(profile);
      } catch (error) {
        // In dev mode with mock backend, use mock data for login
        if (__DEV__ && !USE_REAL_BACKEND) {
          await setToken('mock-dev-token');
          const profile = await fetchProfile();
          setUser(profile);
          return;
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setToken, setUser],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth-logout').catch(() => {
        // Best-effort server logout
      });
    } finally {
      await storeLogout();
      setIsLoading(false);
    }
  }, [storeLogout]);

  return {
    login,
    logout,
    isAuthenticated,
    user,
    isLoading,
  };
}
