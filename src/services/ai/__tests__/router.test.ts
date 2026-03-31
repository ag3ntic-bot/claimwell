import { MockAIProvider } from '../providers/mock';
import type { AIProvider } from '../providers/types';
import type { AITask, AIInput, AIOutput } from '@/types';
import { AI_TASK_CONFIG } from '@/types';

// We cannot import aiRouter directly because it uses __DEV__ at module scope,
// so we test the AIRouter behavior through a fresh instance approach.
// Instead we'll test through the exported singleton after setting the provider.

jest.mock('../providers/anthropic', () => ({
  AnthropicProvider: jest.fn().mockImplementation(() => ({
    complete: jest.fn(),
  })),
}));

// aiRouter uses __DEV__ which defaults to true in jest-expo
import { aiRouter } from '../router';

describe('AIRouter', () => {
  beforeEach(() => {
    aiRouter.clearCache();
    // Ensure mock provider is active
    aiRouter.setProvider(new MockAIProvider());
  });

  it('routes to mock provider and returns output', async () => {
    const output = await aiRouter.complete('summarize', { text: 'Test evidence text' });

    expect(output).toBeDefined();
    expect(output.content).toBeDefined();
    expect(output.tokensUsed).toBeGreaterThan(0);
    expect(output.model).toBeDefined();
  });

  it('caches repeat calls with the same input', async () => {
    const input: AIInput = { text: 'Test evidence text for caching' };

    const first = await aiRouter.complete('summarize', input);
    const second = await aiRouter.complete('summarize', input);

    expect(second.cached).toBe(true);
    expect(second.content).toBe(first.content);
  });

  it('returns different outputs for different task types', async () => {
    const summarizeOutput = await aiRouter.complete('summarize', { text: 'text' });
    aiRouter.clearCache();
    const extractOutput = await aiRouter.complete('extract', { text: 'text' });

    // These should be different mock outputs
    expect(summarizeOutput.content).not.toBe(extractOutput.content);
  });

  it('returns correct task config for different tiers', () => {
    const tier1Task = aiRouter.getTaskConfig('summarize');
    const tier2Task = aiRouter.getTaskConfig('score_claim');
    const tier3Task = aiRouter.getTaskConfig('generate_strategy');

    expect(tier1Task.tier).toBe(1);
    expect(tier2Task.tier).toBe(2);
    expect(tier3Task.tier).toBe(3);
  });

  it('throws for unknown task types', async () => {
    await expect(aiRouter.complete('nonexistent_task', {})).rejects.toThrow(
      'Unknown AI task type: nonexistent_task',
    );
  });

  it('getTaskConfig throws for unknown task types', () => {
    expect(() => aiRouter.getTaskConfig('nonexistent')).toThrow(
      'Unknown AI task type: nonexistent',
    );
  });

  it('clearCache removes cached entries', async () => {
    const input: AIInput = { text: 'cache test' };
    await aiRouter.complete('summarize', input);

    aiRouter.clearCache();

    const output = await aiRouter.complete('summarize', input);
    expect(output.cached).toBe(false);
  });

  it('allows setting a custom provider', async () => {
    const mockOutput: AIOutput = {
      content: 'custom provider output',
      tokensUsed: 100,
      model: 'custom-model',
      latencyMs: 50,
      cached: false,
    };

    const customProvider: AIProvider = {
      complete: jest.fn().mockResolvedValue(mockOutput),
    };

    aiRouter.setProvider(customProvider);
    aiRouter.clearCache();

    const result = await aiRouter.complete('summarize', { text: 'test' });
    expect(result.content).toBe('custom provider output');
    expect(customProvider.complete).toHaveBeenCalled();
  });
});
