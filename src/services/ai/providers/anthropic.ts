import type { AITask, AIInput, AIOutput, AITier, AITaskType } from '@/types';
import type { AIProvider } from './types';
import { buildSystemPrompt, buildUserPrompt } from '../prompts';

const TIER_MODEL_MAP: Record<AITier, string> = {
  1: 'claude-3-5-haiku-20241022',
  2: 'claude-sonnet-4-20250514',
  3: 'claude-opus-4-20250514',
};

export class AnthropicProvider implements AIProvider {
  private apiKey: string | null = null;

  configure(apiKey: string): void {
    this.apiKey = apiKey;
  }

  private getModel(tier: AITier): string {
    return TIER_MODEL_MAP[tier];
  }

  async complete(task: AITask, input: AIInput): Promise<AIOutput> {
    if (!this.apiKey) {
      throw new Error(
        'Anthropic provider is not configured for production. Call configure(apiKey) first.',
      );
    }

    const model = this.getModel(task.tier);
    const startTime = Date.now();

    const systemPrompt = buildSystemPrompt(task.type as AITaskType);
    const userMessage = buildUserPrompt(task.type as AITaskType, input);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: task.maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${errorBody}`);
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text: string }>;
      usage: { input_tokens: number; output_tokens: number };
    };

    const content = data.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    let structured: Record<string, unknown> | undefined;
    if (task.responseFormat === 'json') {
      try {
        structured = JSON.parse(content) as Record<string, unknown>;
      } catch {
        // Content is not valid JSON; leave structured undefined
      }
    }

    return {
      content,
      structured,
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
      model,
      latencyMs: Date.now() - startTime,
      cached: false,
    };
  }

  async *stream(task: AITask, input: AIInput): AsyncGenerator<string> {
    if (!this.apiKey) {
      throw new Error(
        'Anthropic provider is not configured for production. Call configure(apiKey) first.',
      );
    }

    const model = this.getModel(task.tier);
    const systemPrompt = buildSystemPrompt(task.type as AITaskType);
    const userMessage = buildUserPrompt(task.type as AITaskType, input);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: task.maxTokens,
        stream: true,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Anthropic stream error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          if (jsonStr === '[DONE]') return;
          try {
            const event = JSON.parse(jsonStr) as {
              type: string;
              delta?: { type: string; text: string };
            };
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              yield event.delta.text;
            }
          } catch {
            // Skip malformed event lines
          }
        }
      }
    }
  }
}
