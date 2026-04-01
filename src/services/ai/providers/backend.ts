import type { AITask, AIInput, AIOutput } from '@/types';
import type { AIProvider } from './types';
import { apiClient } from '@/services/api/client';

/**
 * AI provider that delegates all calls to Supabase Edge Functions.
 * This keeps API keys server-side and provides budget tracking + caching.
 */
export class BackendAIProvider implements AIProvider {
  async complete(task: AITask, input: AIInput): Promise<AIOutput> {
    const functionName = `ai-${task.type.replace(/_/g, '-')}`;
    const response = await apiClient.post<AIOutput>(`/${functionName}`, {
      ...input,
      claimId: input.claimDetails?.id ?? undefined,
    });
    return response.data;
  }
}
