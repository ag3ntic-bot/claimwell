import { z } from 'zod';

// ─── Zod schemas for every AI output type ───────────────────────────────────

export const AISummarySchema = z.object({
  summary: z.string().min(1),
  keyPoints: z.array(z.string().min(1)),
});

export const AIExtractionSchema = z.object({
  fields: z.record(z.string(), z.union([z.string(), z.number()])),
  confidence: z.number().min(0).max(1),
});

export const AIClaimScoreSchema = z.object({
  score: z.number().min(0).max(100),
  reasoning: z.string().min(1),
  factors: z.array(
    z.object({
      label: z.string().min(1),
      impact: z.enum(['positive', 'negative']),
      weight: z.number().min(0).max(1),
    }),
  ),
});

export const AIStrategySchema = z.object({
  recommendation: z.string().min(1),
  steps: z.array(
    z.object({
      order: z.number().int().min(1),
      action: z.string().min(1),
      rationale: z.string().min(1),
    }),
  ),
});

export const AIDraftSchema = z.object({
  content: z.string().min(1),
  reasoning: z.string().min(1),
  tone: z.string().min(1),
  version: z.string().min(1),
});

export const AIResponseAnalysisSchema = z.object({
  sentiment: z.string().min(1),
  sentimentScore: z.number().min(-1).max(1),
  resolutionProbability: z.number().min(0).max(1),
  tactics: z.array(z.string()),
  recommendation: z.string().min(1),
  strategyDraft: z.string().min(1),
});

export const MissingEvidenceSchema = z.object({
  items: z.array(z.string().min(1)),
});

export const PersonalizedContentSchema = z.object({
  content: z.string().min(1),
});

// ─── Validation utility ─────────────────────────────────────────────────────

export class AIValidationError extends Error {
  public readonly issues: z.ZodError['issues'];

  constructor(taskType: string, zodError: z.ZodError) {
    const issuesSummary = zodError.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    super(`AI output validation failed for "${taskType}":\n${issuesSummary}`);
    this.name = 'AIValidationError';
    this.issues = zodError.issues;
  }
}

/**
 * Validate raw AI output against a Zod schema.
 * Parses the structured object (or falls back to JSON.parse on content),
 * validates it, and returns the typed result.
 *
 * Throws `AIValidationError` with detailed field-level messages on failure.
 */
export function validateAIOutput<T>(
  schema: z.ZodType<T>,
  raw: { structured?: Record<string, unknown>; content: string },
  taskType: string,
): T {
  let data: unknown;

  if (raw.structured) {
    data = raw.structured;
  } else {
    try {
      data = JSON.parse(raw.content);
    } catch {
      throw new AIValidationError(taskType, new z.ZodError([
        {
          code: 'custom',
          message: `Failed to parse AI output as JSON: ${raw.content.slice(0, 200)}`,
          path: [],
        },
      ]));
    }
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(
      `[AI Validation] Task "${taskType}" produced invalid output:`,
      result.error.issues,
    );
    throw new AIValidationError(taskType, result.error);
  }

  return result.data;
}
