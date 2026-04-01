// deno-lint-ignore-file no-explicit-any

const DAILY_LIMITS: Record<number, number> = {
  1: 500_000,
  2: 300_000,
  3: 100_000,
};

/**
 * Check if the user still has budget remaining for the given tier.
 * Uses service role client to bypass RLS on ai_usage_log.
 */
export async function checkBudget(
  serviceClient: any,
  userId: string,
  tier: number,
): Promise<boolean> {
  const { data, error } = await serviceClient.rpc('get_daily_ai_usage', {
    p_user_id: userId,
    p_tier: tier,
  });

  if (error) {
    console.warn('[AI Budget] Failed to check budget:', error.message);
    return true; // Fail open — don't block users on budget check errors
  }

  return (data ?? 0) < (DAILY_LIMITS[tier] ?? 500_000);
}

/**
 * Log token usage after a successful AI call.
 */
export async function logUsage(
  serviceClient: any,
  userId: string,
  taskType: string,
  tier: number,
  tokensUsed: number,
  model: string,
  latencyMs: number,
  claimId?: string,
): Promise<void> {
  const { error } = await serviceClient.from('ai_usage_log').insert({
    user_id: userId,
    task_type: taskType,
    tier,
    tokens_used: tokensUsed,
    model,
    latency_ms: latencyMs,
    claim_id: claimId ?? null,
  });

  if (error) {
    console.warn('[AI Budget] Failed to log usage:', error.message);
  }
}
