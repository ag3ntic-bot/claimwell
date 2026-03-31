import type { AIExtraction } from '@/types';
import { aiRouter } from '../router';
import { AIExtractionSchema, validateAIOutput } from '../validation';

export async function extractFromDocument(text: string): Promise<AIExtraction> {
  const output = await aiRouter.complete('extract', { text });
  return validateAIOutput(AIExtractionSchema, output, 'extract');
}
