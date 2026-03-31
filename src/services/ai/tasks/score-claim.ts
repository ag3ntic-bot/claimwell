import type { AIClaimScore } from '@/types';
import { aiRouter } from '../router';
import { AIClaimScoreSchema, validateAIOutput } from '../validation';

export async function scoreClaimStrength(
  claimDetails: Record<string, unknown>,
  evidenceTexts: string[],
): Promise<AIClaimScore> {
  const output = await aiRouter.complete('score_claim', {
    claimDetails,
    evidenceTexts,
  });
  return validateAIOutput(AIClaimScoreSchema, output, 'score_claim');
}
