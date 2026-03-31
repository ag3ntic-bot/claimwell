import { MockAIProvider } from '../../providers/mock';
import { aiRouter } from '../../router';
import { analyzeResponse } from '../analyze-response';
import type { AIResponseAnalysis } from '@/types';

jest.mock('../../providers/anthropic', () => ({
  AnthropicProvider: jest.fn(),
}));

describe('analyzeResponse', () => {
  beforeEach(() => {
    aiRouter.setProvider(new MockAIProvider());
    aiRouter.clearCache();
  });

  it('returns an AIResponseAnalysis structure', async () => {
    const result: AIResponseAnalysis = await analyzeResponse(
      'We have determined the damage is not covered under warranty.',
      { claimId: 'clm_01', category: 'warranty' },
    );

    expect(result).toBeDefined();
    expect(result.sentiment).toBeDefined();
    expect(typeof result.sentiment).toBe('string');
    expect(result.tactics).toBeDefined();
    expect(Array.isArray(result.tactics)).toBe(true);
    expect(result.recommendation).toBeDefined();
    expect(typeof result.recommendation).toBe('string');
  });

  it('has a valid sentiment score between -1 and 1', async () => {
    const result = await analyzeResponse(
      'Your claim has been denied.',
      { claimId: 'clm_01' },
    );

    expect(typeof result.sentimentScore).toBe('number');
    expect(result.sentimentScore).toBeGreaterThanOrEqual(-1);
    expect(result.sentimentScore).toBeLessThanOrEqual(1);
  });

  it('has a valid resolution probability between 0 and 1', async () => {
    const result = await analyzeResponse(
      'Your claim has been denied.',
      { claimId: 'clm_01' },
    );

    expect(typeof result.resolutionProbability).toBe('number');
    expect(result.resolutionProbability).toBeGreaterThanOrEqual(0);
    expect(result.resolutionProbability).toBeLessThanOrEqual(1);
  });

  it('returns tactics as an array of strings', async () => {
    const result = await analyzeResponse(
      'The damage appears to be accidental.',
      { claimId: 'clm_01' },
    );

    expect(result.tactics.length).toBeGreaterThan(0);
    for (const tactic of result.tactics) {
      expect(typeof tactic).toBe('string');
    }
  });

  it('includes a strategy draft', async () => {
    const result = await analyzeResponse(
      'We cannot process your request at this time.',
      { claimId: 'clm_01' },
    );

    expect(result.strategyDraft).toBeDefined();
    expect(typeof result.strategyDraft).toBe('string');
    expect(result.strategyDraft.length).toBeGreaterThan(0);
  });
});
