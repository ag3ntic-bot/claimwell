import type { AIDraft } from '@/types';
import { aiRouter } from '../router';
import { AIDraftSchema, validateAIOutput } from '../validation';

export async function generateDraft(
  claimDetails: Record<string, unknown>,
  tone: string,
  context: Record<string, unknown>,
): Promise<AIDraft> {
  const output = await aiRouter.complete('generate_draft', {
    claimDetails,
    tone,
    context,
  });
  return validateAIOutput(AIDraftSchema, output, 'generate_draft');
}
