jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

import { useAuthStore } from '../auth.store';
import { mockUser } from '@/testing/fixtures';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('setUser updates user and sets isAuthenticated to true', () => {
    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser with null sets isAuthenticated to false', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setUser(null);

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setToken stores token and sets isAuthenticated', async () => {
    await useAuthStore.getState().setToken('test-token-123');

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token-123');
    expect(state.isAuthenticated).toBe(true);
  });

  it('setToken with null clears token and isAuthenticated', async () => {
    await useAuthStore.getState().setToken('test-token-123');
    await useAuthStore.getState().setToken(null);

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('logout clears user, token, and isAuthenticated', async () => {
    useAuthStore.getState().setUser(mockUser);
    await useAuthStore.getState().setToken('test-token-123');

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
