import { useMutation } from '@tanstack/react-query';
import type { AIResponseAnalysis } from '@/types';
import { analyzeResponse } from '@/services/ai/tasks/analyze-response';

interface AnalyzeResponseInput {
  responseText: string;
  claimContext: Record<string, unknown>;
}

export function useAnalyzeResponse() {
  return useMutation<AIResponseAnalysis, Error, AnalyzeResponseInput>({
    mutationFn: ({ responseText, claimContext }) => analyzeResponse(responseText, claimContext),
  });
}
