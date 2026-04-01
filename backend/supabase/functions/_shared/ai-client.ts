// deno-lint-ignore-file no-explicit-any

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const TIER_MODEL_MAP: Record<number, string> = {
  1: 'claude-haiku-4-5-20251001',
  2: 'claude-sonnet-4-6-20250514',
  3: 'claude-opus-4-6-20250514',
};

const RETRY_CONFIG: Record<number, number> = { 1: 2, 2: 2, 3: 1 };
const BASE_DELAY_MS = 200;

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  usage: { input_tokens: number; output_tokens: number };
  model: string;
}

export interface AIResult {
  content: string;
  tokensUsed: number;
  model: string;
  latencyMs: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Call Anthropic API with retry and tier-based model selection.
 */
export async function callAnthropic(options: {
  tier: number;
  maxTokens: number;
  system: string;
  userMessage: string;
}): Promise<AIResult> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const model = TIER_MODEL_MAP[options.tier];
  const maxRetries = RETRY_CONFIG[options.tier] ?? 1;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();

      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: options.maxTokens,
          system: options.system,
          messages: [{ role: 'user', content: options.userMessage }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        const status = response.status;

        // Rate limited — respect retry-after
        if (status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') ?? '5', 10);
          if (attempt < maxRetries) {
            await sleep(retryAfter * 1000);
            continue;
          }
        }

        // Server error — retry with backoff
        if (status >= 500 && attempt < maxRetries) {
          await sleep(BASE_DELAY_MS * Math.pow(2, attempt));
          continue;
        }

        throw new Error(`Anthropic API error ${status}: ${errorBody}`);
      }

      const data: AnthropicResponse = await response.json();
      const latencyMs = Date.now() - startTime;

      const content = data.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('');

      return {
        content,
        tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
        model: data.model,
        latencyMs,
      };
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await sleep(BASE_DELAY_MS * Math.pow(2, attempt));
      }
    }
  }

  // Tier 3 fallback to tier 2
  if (options.tier === 3) {
    console.warn(`[AI] Tier 3 failed, falling back to tier 2`);
    return callAnthropic({ ...options, tier: 2 });
  }

  throw lastError;
}
