export { aiRouter, BudgetExceededError } from './router';
export type { AIObserver } from './router';
export type { AIProvider } from './providers/types';
export { MockAIProvider } from './providers/mock';
export type { MockAIProviderOptions } from './providers/mock';
export { AnthropicProvider } from './providers/anthropic';

export { summarizeEvidence } from './tasks/summarize';
export { extractFromDocument } from './tasks/extract';
export { scoreClaimStrength } from './tasks/score-claim';
export { detectMissingEvidence } from './tasks/detect-missing';
export { generateStrategy } from './tasks/generate-strategy';
export { analyzeResponse } from './tasks/analyze-response';
export { generateDraft } from './tasks/generate-draft';
export { personalizeTemplate } from './tasks/personalize-template';

export {
  AISummarySchema,
  AIExtractionSchema,
  AIClaimScoreSchema,
  AIStrategySchema,
  AIDraftSchema,
  AIResponseAnalysisSchema,
  MissingEvidenceSchema,
  PersonalizedContentSchema,
  AIValidationError,
  validateAIOutput,
} from './validation';

export { getPrompt, buildSystemPrompt, buildUserPrompt, getPromptVersion } from './prompts';
export type { PromptTemplate } from './prompts';
