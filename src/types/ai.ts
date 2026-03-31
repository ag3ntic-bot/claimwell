export type AITaskType =
  | 'summarize'
  | 'extract'
  | 'score_claim'
  | 'detect_missing'
  | 'generate_strategy'
  | 'analyze_response'
  | 'generate_draft'
  | 'personalize_template';

export type AITier = 1 | 2 | 3;

export type AIResponseFormat = 'json' | 'text' | 'markdown';

export interface AITask {
  type: AITaskType;
  tier: AITier;
  maxTokens: number;
  responseFormat: AIResponseFormat;
}

export interface AIInput {
  text?: string;
  context?: Record<string, unknown>;
  evidenceTexts?: string[];
  claimDetails?: Record<string, unknown>;
  tone?: string;
  templateContent?: string;
}

export interface AIOutput {
  content: string;
  structured?: Record<string, unknown>;
  tokensUsed: number;
  model: string;
  latencyMs: number;
  cached: boolean;
}

export interface AISummary {
  summary: string;
  keyPoints: string[];
}

export interface AIExtraction {
  fields: Record<string, string | number>;
  confidence: number;
}

export interface AIClaimScore {
  score: number;
  reasoning: string;
  factors: Array<{ label: string; impact: 'positive' | 'negative'; weight: number }>;
}

export interface AIStrategy {
  recommendation: string;
  steps: Array<{ order: number; action: string; rationale: string }>;
}

export interface AIDraft {
  content: string;
  reasoning: string;
  tone: string;
  version: string;
}

export interface AIResponseAnalysis {
  sentiment: string;
  sentimentScore: number;
  resolutionProbability: number;
  tactics: string[];
  recommendation: string;
  strategyDraft: string;
}

export const AI_TASK_CONFIG: Record<AITaskType, AITask> = {
  summarize: { type: 'summarize', tier: 1, maxTokens: 500, responseFormat: 'json' },
  extract: { type: 'extract', tier: 1, maxTokens: 800, responseFormat: 'json' },
  score_claim: { type: 'score_claim', tier: 2, maxTokens: 1000, responseFormat: 'json' },
  detect_missing: { type: 'detect_missing', tier: 1, maxTokens: 500, responseFormat: 'json' },
  generate_strategy: { type: 'generate_strategy', tier: 3, maxTokens: 2000, responseFormat: 'json' },
  analyze_response: { type: 'analyze_response', tier: 2, maxTokens: 1500, responseFormat: 'json' },
  generate_draft: { type: 'generate_draft', tier: 3, maxTokens: 3000, responseFormat: 'markdown' },
  personalize_template: {
    type: 'personalize_template',
    tier: 2,
    maxTokens: 2000,
    responseFormat: 'markdown',
  },
};
