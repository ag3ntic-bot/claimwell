import type { AITaskType, AIInput, AIResponseFormat } from '@/types';

// ─── Prompt versioning ──────────────────────────────────────────────────────

const PROMPT_VERSION = '1.0.0';

export interface PromptTemplate {
  version: string;
  system: string;
  user: (input: AIInput) => string;
}

// ─── Shared fragments ───────────────────────────────────────────────────────

const SYSTEM_PREAMBLE =
  'You are an AI assistant for Claimwell, a consumer claims advocacy app. ' +
  'You help users build, strengthen, and manage warranty and consumer protection claims.';

function formatInstruction(format: AIResponseFormat): string {
  switch (format) {
    case 'json':
      return 'Respond with valid JSON only. No markdown fences, no extra text.';
    case 'markdown':
      return 'Respond in well-structured Markdown.';
    default:
      return 'Respond in plain text.';
  }
}

function inputSection(label: string, value: string | undefined): string {
  return value ? `\n\n## ${label}\n${value}` : '';
}

function jsonSection(label: string, obj: Record<string, unknown> | undefined): string {
  return obj ? `\n\n## ${label}\n${JSON.stringify(obj, null, 2)}` : '';
}

// ─── Per-task prompt templates ──────────────────────────────────────────────

const summarizePrompt: PromptTemplate = {
  version: PROMPT_VERSION,
  system:
    `${SYSTEM_PREAMBLE}\n\n` +
    `${formatInstruction('json')}\n\n` +
    'Your task is to produce a concise summary of evidence text and extract key points.\n\n' +
    'Return JSON matching this schema:\n' +
    '{\n' +
    '  "summary": "A clear 2-4 sentence summary of the evidence",\n' +
    '  "keyPoints": ["point 1", "point 2", ...]\n' +
    '}',
  user: (input) => `Summarize the following evidence:${inputSection('Evidence Text', input.text)}`,
};

const extractPrompt: PromptTemplate = {
  version: PROMPT_VERSION,
  system:
    `${SYSTEM_PREAMBLE}\n\n` +
    `${formatInstruction('json')}\n\n` +
    'Extract structured fields from the provided document. Identify all relevant claim data points ' +
    '(dates, amounts, product names, serial numbers, warranty info, parties involved, etc.).\n\n' +
    'Return JSON matching this schema:\n' +
    '{\n' +
    '  "fields": { "fieldName": "value or number", ... },\n' +
    '  "confidence": 0.0-1.0\n' +
    '}\n\n' +
    '### Examples\n\n' +
    'Input: "Purchased MacBook Pro on 2024-01-15 for $2,499 from Apple Store. Serial: FVFC12345XY."\n' +
    'Output:\n' +
    '{\n' +
    '  "fields": {\n' +
    '    "product": "MacBook Pro",\n' +
    '    "purchaseDate": "2024-01-15",\n' +
    '    "price": 2499,\n' +
    '    "retailer": "Apple Store",\n' +
    '    "serialNumber": "FVFC12345XY"\n' +
    '  },\n' +
    '  "confidence": 0.95\n' +
    '}',
  user: (input) => `Extract structured data from this document:${inputSection('Document Text', input.text)}`,
};

const scoreClaimPrompt: PromptTemplate = {
  version: PROMPT_VERSION,
  system:
    `${SYSTEM_PREAMBLE}\n\n` +
    `${formatInstruction('json')}\n\n` +
    'Evaluate the strength of a consumer claim on a scale of 0-100. Consider:\n' +
    '- Quality and completeness of evidence\n' +
    '- Legal standing and warranty coverage\n' +
    '- Precedent and known issues\n' +
    '- Contradictions in the company\'s response\n\n' +
    'Return JSON matching this schema:\n' +
    '{\n' +
    '  "score": 0-100,\n' +
    '  "reasoning": "Clear explanation of the score",\n' +
    '  "factors": [\n' +
    '    { "label": "Factor name", "impact": "positive"|"negative", "weight": 0.0-1.0 }\n' +
    '  ]\n' +
    '}',
  user: (input) => {
    const parts: string[] = ['Evaluate this claim:'];
    parts.push(jsonSection('Claim Details', input.claimDetails));
    if (input.evidenceTexts?.length) {
      parts.push(`\n\n## Supporting Evidence\n${input.evidenceTexts.join('\n---\n')}`);
    }
    return parts.join('');
  },
};

const detectMissingPrompt: PromptTemplate = {
  version: PROMPT_VERSION,
  system:
    `${SYSTEM_PREAMBLE}\n\n` +
    `${formatInstruction('json')}\n\n` +
    'Analyze the claim and its current evidence to identify missing documentation or evidence ' +
    'that would strengthen the claim. Be specific and actionable.\n\n' +
    'Return JSON matching this schema:\n' +
    '{\n' +
    '  "items": ["specific missing evidence item 1", "specific missing evidence item 2", ...]\n' +
    '}',
  user: (input) => {
    const parts: string[] = ['Identify missing evidence for this claim:'];
    parts.push(jsonSection('Claim Details', input.claimDetails));
    if (input.evidenceTexts?.length) {
      parts.push(`\n\n## Current Evidence\n${input.evidenceTexts.join('\n---\n')}`);
    }
    return parts.join('');
  },
};

const generateStrategyPrompt: PromptTemplate = {
  version: PROMPT_VERSION,
  system:
    `${SYSTEM_PREAMBLE}\n\n` +
    `${formatInstruction('json')}\n\n` +
    'Generate a step-by-step escalation strategy for the consumer claim. Each step should be ' +
    'actionable with a clear rationale. Order steps from least to most aggressive.\n\n' +
    'Return JSON matching this schema:\n' +
    '{\n' +
    '  "recommendation": "High-level strategy summary",\n' +
    '  "steps": [\n' +
    '    { "order": 1, "action": "Specific action to take", "rationale": "Why this step" }\n' +
    '  ]\n' +
    '}',
  user: (input) => {
    const parts: string[] = ['Generate an escalation strategy:'];
    parts.push(jsonSection('Claim Details', input.claimDetails));
    parts.push(jsonSection('Additional Context', input.context));
    return parts.join('');
  },
};

const analyzeResponsePrompt: PromptTemplate = {
  version: PROMPT_VERSION,
  system:
    `${SYSTEM_PREAMBLE}\n\n` +
    `${formatInstruction('json')}\n\n` +
    'Analyze a company\'s response to a consumer claim. Identify sentiment, resolution probability, ' +
    'tactics used by the company, and recommend next steps.\n\n' +
    'Return JSON matching this schema:\n' +
    '{\n' +
    '  "sentiment": "positive"|"negative"|"neutral",\n' +
    '  "sentimentScore": -1.0 to 1.0,\n' +
    '  "resolutionProbability": 0.0 to 1.0,\n' +
    '  "tactics": ["tactic 1", ...],\n' +
    '  "recommendation": "What the user should do next",\n' +
    '  "strategyDraft": "Draft of suggested response or next action"\n' +
    '}',
  user: (input) => {
    const parts: string[] = ['Analyze this company response:'];
    parts.push(inputSection('Response Text', input.text));
    parts.push(jsonSection('Claim Context', input.context));
    return parts.join('');
  },
};

const generateDraftPrompt: PromptTemplate = {
  version: PROMPT_VERSION,
  system:
    `${SYSTEM_PREAMBLE}\n\n` +
    `${formatInstruction('json')}\n\n` +
    'Generate a draft communication (letter, email, or message) for the consumer to send ' +
    'as part of their claim process. Match the requested tone.\n\n' +
    'Return JSON matching this schema:\n' +
    '{\n' +
    '  "content": "The full draft text in markdown",\n' +
    '  "reasoning": "Why this approach was chosen",\n' +
    '  "tone": "The tone used",\n' +
    '  "version": "1.0"\n' +
    '}',
  user: (input) => {
    const parts: string[] = ['Generate a draft communication:'];
    parts.push(jsonSection('Claim Details', input.claimDetails));
    if (input.tone) parts.push(`\n\n## Requested Tone\n${input.tone}`);
    parts.push(jsonSection('Additional Context', input.context));
    return parts.join('');
  },
};

const personalizeTemplatePrompt: PromptTemplate = {
  version: PROMPT_VERSION,
  system:
    `${SYSTEM_PREAMBLE}\n\n` +
    `${formatInstruction('json')}\n\n` +
    'Personalize the provided template with the user\'s specific claim details. ' +
    'Fill in all placeholders and adapt language to fit the specific situation.\n\n' +
    'Return JSON matching this schema:\n' +
    '{\n' +
    '  "content": "The personalized template content"\n' +
    '}',
  user: (input) => {
    const parts: string[] = ['Personalize this template:'];
    parts.push(inputSection('Template', input.templateContent));
    parts.push(jsonSection('Claim Details', input.claimDetails));
    return parts.join('');
  },
};

// ─── Registry ───────────────────────────────────────────────────────────────

const PROMPTS: Record<AITaskType, PromptTemplate> = {
  summarize: summarizePrompt,
  extract: extractPrompt,
  score_claim: scoreClaimPrompt,
  detect_missing: detectMissingPrompt,
  generate_strategy: generateStrategyPrompt,
  analyze_response: analyzeResponsePrompt,
  generate_draft: generateDraftPrompt,
  personalize_template: personalizeTemplatePrompt,
};

/**
 * Get the prompt template for a given task type.
 */
export function getPrompt(taskType: AITaskType): PromptTemplate {
  const prompt = PROMPTS[taskType];
  if (!prompt) {
    throw new Error(`No prompt template found for task type: ${taskType}`);
  }
  return prompt;
}

/**
 * Build the full system prompt string for a task.
 */
export function buildSystemPrompt(taskType: AITaskType): string {
  return getPrompt(taskType).system;
}

/**
 * Build the full user message for a task with the given input.
 */
export function buildUserPrompt(taskType: AITaskType, input: AIInput): string {
  return getPrompt(taskType).user(input);
}

/**
 * Get the prompt version (useful for logging / A/B testing).
 */
export function getPromptVersion(taskType: AITaskType): string {
  return getPrompt(taskType).version;
}
