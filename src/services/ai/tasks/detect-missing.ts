import { aiRouter } from '../router';
import { MissingEvidenceSchema, validateAIOutput } from '../validation';

export async function detectMissingEvidence(
  claimDetails: Record<string, unknown>,
  evidenceTexts: string[],
): Promise<{ items: string[] }> {
  const output = await aiRouter.complete('detect_missing', {
    claimDetails,
    evidenceTexts,
  });
  return validateAIOutput(MissingEvidenceSchema, output, 'detect_missing');
}
