import type { AIResponseAnalysis } from '@/types';
import { aiRouter } from '../router';
import { AIResponseAnalysisSchema, validateAIOutput } from '../validation';

export async function analyzeResponse(
  responseText: string,
  claimContext: Record<string, unknown>,
): Promise<AIResponseAnalysis> {
  const output = await aiRouter.complete('analyze_response', {
    text: responseText,
    context: claimContext,
  });
  return validateAIOutput(AIResponseAnalysisSchema, output, 'analyze_response');
}
