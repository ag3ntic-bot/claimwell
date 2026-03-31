import { MockAIProvider } from '../providers/mock';
import { AI_TASK_CONFIG } from '@/types';
import type { AIOutput, AITaskType } from '@/types';

describe('MockAIProvider', () => {
  let provider: MockAIProvider;

  beforeEach(() => {
    provider = new MockAIProvider();
  });

  it('returns fixture data for summarize task', async () => {
    const task = AI_TASK_CONFIG.summarize;
    const output = await provider.complete(task, { text: 'test' });

    expect(output).toBeDefined();
    expect(output.content).toBeDefined();
    expect(typeof output.content).toBe('string');

    const parsed = JSON.parse(output.content);
    expect(parsed.summary).toBeDefined();
    expect(parsed.keyPoints).toBeDefined();
    expect(Array.isArray(parsed.keyPoints)).toBe(true);
  });

  it('returns fixture data for extract task', async () => {
    const task = AI_TASK_CONFIG.extract;
    const output = await provider.complete(task, { text: 'receipt content' });

    const parsed = JSON.parse(output.content);
    expect(parsed.fields).toBeDefined();
    expect(parsed.confidence).toBeDefined();
    expect(typeof parsed.confidence).toBe('number');
  });

  it('returns fixture data for score_claim task', async () => {
    const task = AI_TASK_CONFIG.score_claim;
    const output = await provider.complete(task, { text: 'claim details' });

    expect(output.structured).toBeDefined();
    expect(output.structured!.score).toBe(84);
    expect(output.structured!.factors).toBeDefined();
  });

  it('returns fixture data for analyze_response task', async () => {
    const task = AI_TASK_CONFIG.analyze_response;
    const output = await provider.complete(task, { text: 'denial text', context: {} });

    expect(output.structured).toBeDefined();
    expect(output.structured!.sentiment).toBe('negative');
    expect(output.structured!.sentimentScore).toBeDefined();
  });

  it('returns fixture data for generate_draft task', async () => {
    const task = AI_TASK_CONFIG.generate_draft;
    const output = await provider.complete(task, { text: 'claim', tone: 'assertive' });

    const parsed = JSON.parse(output.content);
    expect(parsed.content).toBeDefined();
    expect(parsed.tone).toBe('assertive');
  });

  it('returns fixture data for generate_strategy task', async () => {
    const task = AI_TASK_CONFIG.generate_strategy;
    const output = await provider.complete(task, { claimDetails: {} });

    expect(output.structured).toBeDefined();
    expect(output.structured!.recommendation).toBeDefined();
  });

  it('returns correct AIOutput structure with required fields', async () => {
    const task = AI_TASK_CONFIG.summarize;
    const output: AIOutput = await provider.complete(task, { text: 'test' });

    expect(typeof output.content).toBe('string');
    expect(typeof output.tokensUsed).toBe('number');
    expect(typeof output.model).toBe('string');
    expect(typeof output.latencyMs).toBe('number');
    expect(output.cached).toBe(false);
  });

  it('simulates latency (output has latencyMs)', async () => {
    const task = AI_TASK_CONFIG.summarize;
    const output = await provider.complete(task, { text: 'test' });

    expect(output.latencyMs).toBeGreaterThanOrEqual(200);
    expect(output.latencyMs).toBeLessThan(900);
  });

  it('throws for unknown task types', async () => {
    const unknownTask = { type: 'unknown_task' as AITaskType, tier: 1 as const, maxTokens: 500, responseFormat: 'json' as const };
    await expect(provider.complete(unknownTask, { text: 'test' })).rejects.toThrow(
      'No mock output defined for task type: unknown_task',
    );
  });

  it('stream yields content in chunks', async () => {
    const task = AI_TASK_CONFIG.summarize;
    const chunks: string[] = [];

    for await (const chunk of provider.stream(task, { text: 'test' })) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBeGreaterThan(0);
    const fullContent = chunks.join('');
    expect(fullContent.length).toBeGreaterThan(0);
  });
});
