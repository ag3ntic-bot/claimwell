import type { AISummary } from '@/types';
import { aiRouter } from '../router';
import { AISummarySchema, validateAIOutput } from '../validation';

export async function summarizeEvidence(evidenceText: string): Promise<AISummary> {
  const output = await aiRouter.complete('summarize', { text: evidenceText });
  return validateAIOutput(AISummarySchema, output, 'summarize');
}
