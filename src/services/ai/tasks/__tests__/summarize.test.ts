import { MockAIProvider } from '../../providers/mock';
import { aiRouter } from '../../router';
import { summarizeEvidence } from '../summarize';
import type { AISummary } from '@/types';

jest.mock('@/services/api/client', () => ({
  USE_REAL_BACKEND: false,
  apiClient: { post: jest.fn(), get: jest.fn() },
  ApiError: class extends Error {},
}));

jest.mock('../../providers/backend', () => ({
  BackendAIProvider: jest.fn(),
}));

describe('summarizeEvidence', () => {
  beforeEach(() => {
    aiRouter.setProvider(new MockAIProvider());
    aiRouter.clearCache();
  });

  it('returns an AISummary with summary and keyPoints', async () => {
    const result: AISummary = await summarizeEvidence(
      'iPhone 15 Pro Max display flickering and unresponsive touch zones.',
    );

    expect(result).toBeDefined();
    expect(typeof result.summary).toBe('string');
    expect(result.summary.length).toBeGreaterThan(0);
    expect(Array.isArray(result.keyPoints)).toBe(true);
    expect(result.keyPoints.length).toBeGreaterThan(0);
  });

  it('keyPoints contains meaningful strings', async () => {
    const result = await summarizeEvidence('Test evidence.');

    for (const point of result.keyPoints) {
      expect(typeof point).toBe('string');
      expect(point.length).toBeGreaterThan(0);
    }
  });

  it('handles different input text', async () => {
    // The mock provider returns the same fixture regardless of input,
    // but the function should not throw for any valid input.
    const result = await summarizeEvidence('Completely different evidence text about a refund.');

    expect(result.summary).toBeDefined();
    expect(result.keyPoints).toBeDefined();
  });
});
