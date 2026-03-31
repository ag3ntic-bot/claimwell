jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

const mockAnalyzeResponse = jest.fn();

jest.mock('@/services/ai/tasks/analyze-response', () => ({
  analyzeResponse: (...args: unknown[]) => mockAnalyzeResponse(...args),
}));

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAnalyzeResponse } from '../useAnalyzeResponse';

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children);
  };
}

const mockResult = {
  sentiment: 'Dismissive',
  sentimentScore: -0.6,
  resolutionProbability: 0.3,
  tactics: ['Deflection'],
  recommendation: 'Escalate.',
  strategyDraft: 'Draft complaint...',
};

describe('useAnalyzeResponse', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns analysis on success', async () => {
    mockAnalyzeResponse.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useAnalyzeResponse(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ responseText: 'Denied.', claimContext: {} });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResult);
  });

  it('sets error state on failure', async () => {
    mockAnalyzeResponse.mockRejectedValue(new Error('AI unavailable'));
    const { result } = renderHook(() => useAnalyzeResponse(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ responseText: 'text', claimContext: {} });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error!.message).toBe('AI unavailable');
  });

  it('is idle before mutation', () => {
    const { result } = renderHook(() => useAnalyzeResponse(), { wrapper: createWrapper() });
    expect(result.current.isIdle).toBe(true);
  });
});
