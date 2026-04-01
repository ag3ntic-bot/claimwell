jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

const mockSetUser = jest.fn();
const mockSetToken = jest.fn().mockResolvedValue(undefined);
const mockStoreLogout = jest.fn().mockResolvedValue(undefined);
const mockGetToken = jest.fn();
const mockSetTokenStorage = jest.fn().mockResolvedValue(undefined);
const mockClearToken = jest.fn().mockResolvedValue(undefined);
const mockSetRefreshToken = jest.fn().mockResolvedValue(undefined);
const mockFetchProfile = jest.fn();
const mockApiPost = jest.fn();

let mockIsAuthenticated = false;
let mockUser: Record<string, unknown> | null = null;

jest.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    isAuthenticated: mockIsAuthenticated,
    user: mockUser,
    setUser: mockSetUser,
    setToken: mockSetToken,
    logout: mockStoreLogout,
  }),
}));

jest.mock('@/services/storage/secure', () => ({
  secureStorage: {
    getToken: (...args: unknown[]) => mockGetToken(...args),
    setToken: (...args: unknown[]) => mockSetTokenStorage(...args),
    clearToken: (...args: unknown[]) => mockClearToken(...args),
    setRefreshToken: (...args: unknown[]) => mockSetRefreshToken(...args),
    clearAll: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/services/api/user', () => ({
  fetchProfile: (...args: unknown[]) => mockFetchProfile(...args),
}));

jest.mock('@/services/api/client', () => ({
  apiClient: {
    post: (...args: unknown[]) => mockApiPost(...args),
  },
  ApiError: class extends Error {
    constructor(msg: string) {
      super(msg);
    }
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '../useAuth';

(globalThis as Record<string, unknown>).__DEV__ = true;

describe('useAuth', () => {
  const mockProfile = {
    id: 'usr_01',
    name: 'Alexander Vance',
    email: 'alex@test.com',
    avatarUri: null,
    subscriptionTier: 'pro',
    createdAt: '2024-06-15T08:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = false;
    mockUser = null;
    mockGetToken.mockResolvedValue(null);
  });

  it('hydrates auth state when token exists', async () => {
    mockGetToken.mockResolvedValue('existing-token');
    mockFetchProfile.mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockSetToken).toHaveBeenCalledWith('existing-token');
    expect(mockFetchProfile).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(mockProfile);
  });

  it('clears auth on hydration failure', async () => {
    mockGetToken.mockResolvedValue('bad-token');
    mockFetchProfile.mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockStoreLogout).toHaveBeenCalled();
  });

  it('login sets token and user on success', async () => {
    mockGetToken.mockResolvedValue(null);
    mockApiPost.mockResolvedValue({
      data: { token: 'new-token', refreshToken: 'refresh-token' },
    });
    mockFetchProfile.mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('alex@test.com', 'password123');
    });

    expect(mockApiPost).toHaveBeenCalledWith('/auth-login', {
      email: 'alex@test.com',
      password: 'password123',
    });
    expect(mockSetToken).toHaveBeenCalledWith('new-token');
  });

  it('login falls back to mock in dev mode', async () => {
    mockGetToken.mockResolvedValue(null);
    mockApiPost.mockRejectedValue(new Error('Network error'));
    mockFetchProfile.mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('alex@test.com', 'password');
    });

    expect(mockSetToken).toHaveBeenCalledWith('mock-dev-token');
  });

  it('logout clears state', async () => {
    mockGetToken.mockResolvedValue(null);
    mockApiPost.mockResolvedValue({});

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(mockStoreLogout).toHaveBeenCalled();
  });

  it('logout handles server failure gracefully', async () => {
    mockGetToken.mockResolvedValue(null);
    mockApiPost.mockRejectedValue(new Error('Server down'));

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(mockStoreLogout).toHaveBeenCalled();
  });

  it('reflects store auth state', () => {
    mockIsAuthenticated = true;
    mockUser = mockProfile;

    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockProfile);
  });
});
