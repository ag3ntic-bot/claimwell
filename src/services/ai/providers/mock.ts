import type { AITask, AIInput, AIOutput } from '@/types';
import {
  mockSummarizeOutput,
  mockExtractOutput,
  mockStrategyOutput,
  mockDraftOutput,
} from '@/testing/fixtures';
import type { AIProvider } from './types';
import {
  AISummarySchema,
  AIExtractionSchema,
  AIClaimScoreSchema,
  AIStrategySchema,
  AIDraftSchema,
  AIResponseAnalysisSchema,
  MissingEvidenceSchema,
  PersonalizedContentSchema,
  validateAIOutput,
} from '../validation';
import type { z } from 'zod';

// ─── Static mock data ───────────────────────────────────────────────────────

const MOCK_OUTPUTS: Record<string, AIOutput> = {
  summarize: mockSummarizeOutput,
  extract: mockExtractOutput,
  score_claim: {
    content: JSON.stringify({
      score: 84,
      reasoning:
        'Strong evidence base with photographic proof and contradictory support chat. Warranty is valid and no diagnostic report was provided by Apple.',
      factors: [
        { label: 'Within warranty period', impact: 'positive' as const, weight: 0.3 },
        { label: 'Photographic evidence of defect', impact: 'positive' as const, weight: 0.25 },
        { label: 'Support agent contradiction', impact: 'positive' as const, weight: 0.2 },
        { label: 'Known manufacturing issue', impact: 'positive' as const, weight: 0.15 },
        { label: 'No diagnostic report from Apple', impact: 'positive' as const, weight: 0.1 },
      ],
    }),
    structured: {
      score: 84,
      reasoning:
        'Strong evidence base with photographic proof and contradictory support chat.',
      factors: [
        { label: 'Within warranty period', impact: 'positive', weight: 0.3 },
        { label: 'Photographic evidence of defect', impact: 'positive', weight: 0.25 },
        { label: 'Support agent contradiction', impact: 'positive', weight: 0.2 },
        { label: 'Known manufacturing issue', impact: 'positive', weight: 0.15 },
        { label: 'No diagnostic report from Apple', impact: 'positive', weight: 0.1 },
      ],
    },
    tokensUsed: 420,
    model: 'mock-sonnet',
    latencyMs: 500,
    cached: false,
  },
  detect_missing: {
    content: JSON.stringify({
      items: [
        'Independent diagnostic report from a third-party repair shop',
        'Screenshots of community reports of the same defect',
        'Written confirmation from the Apple Store Genius Bar',
      ],
    }),
    structured: {
      items: [
        'Independent diagnostic report from a third-party repair shop',
        'Screenshots of community reports of the same defect',
        'Written confirmation from the Apple Store Genius Bar',
      ],
    },
    tokensUsed: 180,
    model: 'mock-haiku',
    latencyMs: 300,
    cached: false,
  },
  generate_strategy: mockStrategyOutput,
  analyze_response: {
    content: JSON.stringify({
      sentiment: 'negative',
      sentimentScore: -0.65,
      resolutionProbability: 0.35,
      tactics: [
        'Deflection to accidental damage without diagnostic proof',
        'Supervisor override of frontline assessment',
        'Generic denial language without case-specific details',
      ],
      recommendation:
        'Escalate with formal written appeal citing the support agent contradiction and requesting the diagnostic report.',
      strategyDraft:
        'Send a formal appeal letter addressing each denial point. Request the diagnostic report under the Magnuson-Moss Warranty Act.',
    }),
    structured: {
      sentiment: 'negative',
      sentimentScore: -0.65,
      resolutionProbability: 0.35,
      tactics: [
        'Deflection to accidental damage without diagnostic proof',
        'Supervisor override of frontline assessment',
        'Generic denial language without case-specific details',
      ],
      recommendation:
        'Escalate with formal written appeal citing the support agent contradiction and requesting the diagnostic report.',
      strategyDraft:
        'Send a formal appeal letter addressing each denial point.',
    },
    tokensUsed: 580,
    model: 'mock-sonnet',
    latencyMs: 650,
    cached: false,
  },
  generate_draft: mockDraftOutput,
  personalize_template: {
    content: JSON.stringify({
      content: 'Personalized template content based on the claim details.',
    }),
    structured: {
      content: 'Personalized template content based on the claim details.',
    },
    tokensUsed: 340,
    model: 'mock-sonnet',
    latencyMs: 450,
    cached: false,
  },
};

// ─── Schema lookup (same schemas used by task files) ────────────────────────

const TASK_SCHEMAS: Record<string, z.ZodType<unknown>> = {
  summarize: AISummarySchema,
  extract: AIExtractionSchema,
  score_claim: AIClaimScoreSchema,
  detect_missing: MissingEvidenceSchema,
  generate_strategy: AIStrategySchema,
  analyze_response: AIResponseAnalysisSchema,
  generate_draft: AIDraftSchema,
  personalize_template: PersonalizedContentSchema,
};

// ─── Consistent simulated latency per tier ──────────────────────────────────

const TIER_LATENCY_MS: Record<number, number> = {
  1: 300,
  2: 500,
  3: 800,
};

function simulateLatency(tier: number): Promise<void> {
  const base = TIER_LATENCY_MS[tier] ?? 400;
  // Add small jitter (+-10%) for realism without being truly random
  const jitter = base * 0.1 * (Math.random() * 2 - 1);
  return new Promise((resolve) => setTimeout(resolve, Math.max(100, base + jitter)));
}

// ─── Mock provider ──────────────────────────────────────────────────────────

export interface MockAIProviderOptions {
  /** When true, all calls throw a simulated error. Useful for testing error paths. */
  simulateErrors?: boolean;
  /** Custom error message when simulateErrors is true. */
  errorMessage?: string;
  /** Override latency in ms (disables tier-based simulation). */
  fixedLatencyMs?: number;
}

export class MockAIProvider implements AIProvider {
  private options: MockAIProviderOptions;

  constructor(options: MockAIProviderOptions = {}) {
    this.options = options;
  }

  /** Update options at runtime (e.g., toggle error mode in tests). */
  configure(options: Partial<MockAIProviderOptions>): void {
    this.options = { ...this.options, ...options };
  }

  async complete(task: AITask, _input: AIInput): Promise<AIOutput> {
    // Error simulation mode
    if (this.options.simulateErrors) {
      const latency = this.options.fixedLatencyMs ?? 100;
      await new Promise((resolve) => setTimeout(resolve, latency));
      throw new Error(
        this.options.errorMessage ?? `[MockAI] Simulated error for task: ${task.type}`,
      );
    }

    // Simulate network latency
    if (this.options.fixedLatencyMs != null) {
      await new Promise((resolve) => setTimeout(resolve, this.options.fixedLatencyMs));
    } else {
      await simulateLatency(task.tier);
    }

    const output = MOCK_OUTPUTS[task.type];
    if (!output) {
      throw new Error(`No mock output defined for task type: ${task.type}`);
    }

    // Validate mock data against the same Zod schemas used in production
    const schema = TASK_SCHEMAS[task.type];
    if (schema) {
      validateAIOutput(schema, output, `mock:${task.type}`);
    }

    const latencyMs = this.options.fixedLatencyMs ?? TIER_LATENCY_MS[task.tier] ?? 400;

    return { ...output, cached: false, latencyMs };
  }

  async *stream(task: AITask, input: AIInput): AsyncGenerator<string> {
    // Error simulation mode
    if (this.options.simulateErrors) {
      throw new Error(
        this.options.errorMessage ?? `[MockAI] Simulated stream error for task: ${task.type}`,
      );
    }

    const output = await this.complete(task, input);
    const content = output.content;

    // Yield content in consistent, reasonably-sized chunks
    const chunkSize = 40;
    const chunkDelayMs = 25;

    for (let i = 0; i < content.length; i += chunkSize) {
      await new Promise((resolve) => setTimeout(resolve, chunkDelayMs));
      yield content.slice(i, i + chunkSize);
    }
  }
}
