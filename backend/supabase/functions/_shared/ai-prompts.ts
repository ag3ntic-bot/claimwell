// deno-lint-ignore-file no-explicit-any
// Ported from src/services/ai/prompts/index.ts

const SYSTEM_PREAMBLE =
  'You are an AI assistant for Claimwell, a consumer claims advocacy app. ' +
  'You help users build, strengthen, and manage warranty and consumer protection claims.';

const JSON_INSTRUCTION = 'Respond with valid JSON only. No markdown fences, no extra text.';

function inputSection(label: string, value: string | undefined): string {
  return value ? `\n\n## ${label}\n${value}` : '';
}

function jsonSection(label: string, obj: any): string {
  return obj ? `\n\n## ${label}\n${JSON.stringify(obj, null, 2)}` : '';
}

// ── Task configs (tier + maxTokens) ────────────────────────────────────────

export const AI_TASK_CONFIG: Record<string, { tier: number; maxTokens: number }> = {
  summarize:            { tier: 1, maxTokens: 500 },
  extract:              { tier: 1, maxTokens: 800 },
  detect_missing:       { tier: 1, maxTokens: 500 },
  score_claim:          { tier: 2, maxTokens: 1000 },
  analyze_response:     { tier: 2, maxTokens: 1500 },
  personalize_template: { tier: 2, maxTokens: 2000 },
  generate_strategy:    { tier: 3, maxTokens: 2000 },
  generate_draft:       { tier: 3, maxTokens: 3000 },
};

// ── Prompt builders ────────────────────────────────────────────────────────

const PROMPTS: Record<string, { system: string; user: (input: any) => string }> = {
  summarize: {
    system:
      `${SYSTEM_PREAMBLE}\n\n${JSON_INSTRUCTION}\n\n` +
      'Your task is to produce a concise summary of evidence text and extract key points.\n\n' +
      'Return JSON matching this schema:\n' +
      '{\n  "summary": "A clear 2-4 sentence summary of the evidence",\n  "keyPoints": ["point 1", "point 2", ...]\n}',
    user: (input: any) => `Summarize the following evidence:${inputSection('Evidence Text', input.text)}`,
  },

  extract: {
    system:
      `${SYSTEM_PREAMBLE}\n\n${JSON_INSTRUCTION}\n\n` +
      'Extract structured fields from the provided document. Identify all relevant claim data points.\n\n' +
      'Return JSON matching this schema:\n' +
      '{\n  "fields": { "fieldName": "value or number", ... },\n  "confidence": 0.0-1.0\n}',
    user: (input: any) => `Extract structured data from this document:${inputSection('Document Text', input.text)}`,
  },

  score_claim: {
    system:
      `${SYSTEM_PREAMBLE}\n\n${JSON_INSTRUCTION}\n\n` +
      'Evaluate the strength of a consumer claim on a scale of 0-100.\n\n' +
      'Return JSON matching this schema:\n' +
      '{\n  "score": 0-100,\n  "reasoning": "Clear explanation",\n  "factors": [\n    { "label": "Factor name", "impact": "positive"|"negative", "weight": 0.0-1.0 }\n  ]\n}',
    user: (input: any) => {
      const parts = ['Evaluate this claim:'];
      parts.push(jsonSection('Claim Details', input.claimDetails));
      if (input.evidenceTexts?.length) {
        parts.push(`\n\n## Supporting Evidence\n${input.evidenceTexts.join('\n---\n')}`);
      }
      return parts.join('');
    },
  },

  detect_missing: {
    system:
      `${SYSTEM_PREAMBLE}\n\n${JSON_INSTRUCTION}\n\n` +
      'Analyze the claim and its current evidence to identify missing documentation.\n\n' +
      'Return JSON matching this schema:\n' +
      '{\n  "items": ["specific missing evidence item 1", ...]\n}',
    user: (input: any) => {
      const parts = ['Identify missing evidence for this claim:'];
      parts.push(jsonSection('Claim Details', input.claimDetails));
      if (input.evidenceTexts?.length) {
        parts.push(`\n\n## Current Evidence\n${input.evidenceTexts.join('\n---\n')}`);
      }
      return parts.join('');
    },
  },

  generate_strategy: {
    system:
      `${SYSTEM_PREAMBLE}\n\n${JSON_INSTRUCTION}\n\n` +
      'Generate a step-by-step escalation strategy for the consumer claim.\n\n' +
      'Return JSON matching this schema:\n' +
      '{\n  "recommendation": "High-level strategy summary",\n  "steps": [\n    { "order": 1, "action": "Specific action", "rationale": "Why this step" }\n  ]\n}',
    user: (input: any) => {
      const parts = ['Generate an escalation strategy:'];
      parts.push(jsonSection('Claim Details', input.claimDetails));
      parts.push(jsonSection('Additional Context', input.context));
      return parts.join('');
    },
  },

  analyze_response: {
    system:
      `${SYSTEM_PREAMBLE}\n\n${JSON_INSTRUCTION}\n\n` +
      "Analyze a company's response to a consumer claim.\n\n" +
      'Return JSON matching this schema:\n' +
      '{\n  "sentiment": "positive"|"negative"|"neutral",\n  "sentimentScore": -1.0 to 1.0,\n  "resolutionProbability": 0.0 to 1.0,\n  "tactics": ["tactic 1", ...],\n  "recommendation": "What the user should do next",\n  "strategyDraft": "Draft of suggested response or next action"\n}',
    user: (input: any) => {
      const parts = ['Analyze this company response:'];
      parts.push(inputSection('Response Text', input.text));
      parts.push(jsonSection('Claim Context', input.context));
      return parts.join('');
    },
  },

  generate_draft: {
    system:
      `${SYSTEM_PREAMBLE}\n\n${JSON_INSTRUCTION}\n\n` +
      'Generate a draft communication for the consumer to send. Match the requested tone.\n\n' +
      'Return JSON matching this schema:\n' +
      '{\n  "content": "The full draft text in markdown",\n  "reasoning": "Why this approach was chosen",\n  "tone": "The tone used",\n  "version": "1.0"\n}',
    user: (input: any) => {
      const parts = ['Generate a draft communication:'];
      parts.push(jsonSection('Claim Details', input.claimDetails));
      if (input.tone) parts.push(`\n\n## Requested Tone\n${input.tone}`);
      parts.push(jsonSection('Additional Context', input.context));
      return parts.join('');
    },
  },

  personalize_template: {
    system:
      `${SYSTEM_PREAMBLE}\n\n${JSON_INSTRUCTION}\n\n` +
      "Personalize the provided template with the user's specific claim details.\n\n" +
      'Return JSON matching this schema:\n' +
      '{\n  "content": "The personalized template content"\n}',
    user: (input: any) => {
      const parts = ['Personalize this template:'];
      parts.push(inputSection('Template', input.templateContent));
      parts.push(jsonSection('Claim Details', input.claimDetails));
      return parts.join('');
    },
  },
};

export function buildSystemPrompt(taskType: string): string {
  const prompt = PROMPTS[taskType];
  if (!prompt) throw new Error(`No prompt template for task: ${taskType}`);
  return prompt.system;
}

export function buildUserPrompt(taskType: string, input: any): string {
  const prompt = PROMPTS[taskType];
  if (!prompt) throw new Error(`No prompt template for task: ${taskType}`);
  return prompt.user(input);
}
