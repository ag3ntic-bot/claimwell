import { aiRouter } from '../router';
import { PersonalizedContentSchema, validateAIOutput } from '../validation';

export async function personalizeTemplate(
  templateContent: string,
  claimDetails: Record<string, unknown>,
): Promise<{ content: string }> {
  const output = await aiRouter.complete('personalize_template', {
    templateContent,
    claimDetails,
  });
  return validateAIOutput(PersonalizedContentSchema, output, 'personalize_template');
}
