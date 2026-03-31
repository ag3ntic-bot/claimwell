import type { AIStrategy } from '@/types';
import { aiRouter } from '../router';
import { AIStrategySchema, validateAIOutput } from '../validation';

export async function generateStrategy(
  claimDetails: Record<string, unknown>,
  context: Record<string, unknown>,
): Promise<AIStrategy> {
  const output = await aiRouter.complete('generate_strategy', {
    claimDetails,
    context,
  });
  return validateAIOutput(AIStrategySchema, output, 'generate_strategy');
}
