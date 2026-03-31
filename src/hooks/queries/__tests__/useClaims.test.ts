jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

const mockFetchClaims = jest.fn();
const mockFetchClaimSummary = jest.fn();

jest.mock('@/services/api/claims', () => ({
  fetchClaims: (...args: unknown[]) => mockFetchClaims(...args),
  fetchClaimSummary: (...args: unknown[]) => mockFetchClaimSummary(...args),
}));

jest.mock('@/stores/claims.store', () => ({
  useClaimsStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ filterStatus: 'all', searchQuery: '' }),
}));

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClaims, useClaimSummary } from '../useClaims';
import { mockClaims, mockClaimSummary } from '@/testing/fixtures';

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children);
  };
}

describe('useClaims', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns claim data on success', async () => {
    mockFetchClaims.mockResolvedValue(mockClaims);
    const { result } = renderHook(() => useClaims(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockClaims);
  });

  it('returns loading state initially', () => {
    mockFetchClaims.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useClaims(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns error on failure', async () => {
    mockFetchClaims.mockRejectedValue(new Error('Failed'));
    const { result } = renderHook(() => useClaims(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error!.message).toBe('Failed');
  });
});

describe('useClaimSummary', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns summary', async () => {
    mockFetchClaimSummary.mockResolvedValue(mockClaimSummary);
    const { result } = renderHook(() => useClaimSummary(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data!.activeClaims).toBe(3);
  });
});
