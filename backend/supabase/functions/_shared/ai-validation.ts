// deno-lint-ignore-file no-explicit-any
// Lightweight JSON validation (no Zod dependency in Deno Edge Functions)
// Mirrors the schemas from src/services/ai/validation.ts

export class AIValidationError extends Error {
  issues: string[];
  constructor(taskType: string, issues: string[]) {
    super(`AI output validation failed for "${taskType}": ${issues.join('; ')}`);
    this.name = 'AIValidationError';
    this.issues = issues;
  }
}

function assertString(obj: any, field: string, issues: string[]): void {
  if (typeof obj[field] !== 'string' || obj[field].length === 0) {
    issues.push(`${field} must be a non-empty string`);
  }
}

function assertNumber(obj: any, field: string, min: number, max: number, issues: string[]): void {
  if (typeof obj[field] !== 'number' || obj[field] < min || obj[field] > max) {
    issues.push(`${field} must be a number between ${min} and ${max}`);
  }
}

function assertArray(obj: any, field: string, issues: string[]): void {
  if (!Array.isArray(obj[field])) {
    issues.push(`${field} must be an array`);
  }
}

// ── Validators per task type ───────────────────────────────────────────────

const validators: Record<string, (data: any) => string[]> = {
  summarize(data) {
    const issues: string[] = [];
    assertString(data, 'summary', issues);
    assertArray(data, 'keyPoints', issues);
    return issues;
  },

  extract(data) {
    const issues: string[] = [];
    if (!data.fields || typeof data.fields !== 'object') {
      issues.push('fields must be an object');
    }
    assertNumber(data, 'confidence', 0, 1, issues);
    return issues;
  },

  score_claim(data) {
    const issues: string[] = [];
    assertNumber(data, 'score', 0, 100, issues);
    assertString(data, 'reasoning', issues);
    assertArray(data, 'factors', issues);
    return issues;
  },

  detect_missing(data) {
    const issues: string[] = [];
    assertArray(data, 'items', issues);
    return issues;
  },

  generate_strategy(data) {
    const issues: string[] = [];
    assertString(data, 'recommendation', issues);
    assertArray(data, 'steps', issues);
    return issues;
  },

  analyze_response(data) {
    const issues: string[] = [];
    assertString(data, 'sentiment', issues);
    assertNumber(data, 'sentimentScore', -1, 1, issues);
    assertNumber(data, 'resolutionProbability', 0, 1, issues);
    assertArray(data, 'tactics', issues);
    assertString(data, 'recommendation', issues);
    assertString(data, 'strategyDraft', issues);
    return issues;
  },

  generate_draft(data) {
    const issues: string[] = [];
    assertString(data, 'content', issues);
    assertString(data, 'reasoning', issues);
    assertString(data, 'tone', issues);
    assertString(data, 'version', issues);
    return issues;
  },

  personalize_template(data) {
    const issues: string[] = [];
    assertString(data, 'content', issues);
    return issues;
  },
};

/**
 * Parse and validate AI output for a given task type.
 * Returns the parsed object or throws AIValidationError.
 */
export function validateAIOutput(taskType: string, rawContent: string): any {
  let parsed: any;

  try {
    // Strip markdown code fences if the model wraps them
    let cleaned = rawContent.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    parsed = JSON.parse(cleaned.trim());
  } catch {
    throw new AIValidationError(taskType, [`Failed to parse JSON: ${rawContent.slice(0, 200)}`]);
  }

  const validator = validators[taskType];
  if (!validator) {
    return parsed; // No validator — return raw parsed
  }

  const issues = validator(parsed);
  if (issues.length > 0) {
    throw new AIValidationError(taskType, issues);
  }

  return parsed;
}
