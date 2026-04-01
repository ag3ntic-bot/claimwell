// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { createServiceClient } from '../_shared/db.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';
import { callAnthropic } from '../_shared/ai-client.ts';
import { checkBudget, logUsage } from '../_shared/ai-budget.ts';
import { makeCacheKey, getCached, setCache } from '../_shared/ai-cache.ts';
import { buildSystemPrompt, buildUserPrompt, AI_TASK_CONFIG } from '../_shared/ai-prompts.ts';
import { validateAIOutput } from '../_shared/ai-validation.ts';

const TASK_TYPE = 'generate_strategy';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse(405, 'Method not allowed');
  }

  const { user, supabase, error: authError } = await getAuthUser(req);
  if (authError || !user) {
    return errorResponse(401, 'Unauthorized', 'AUTH_REQUIRED');
  }

  const taskConfig = AI_TASK_CONFIG[TASK_TYPE];

  try {
    const input = await req.json();
    const serviceClient = createServiceClient();

    // Budget check
    const budgetOk = await checkBudget(serviceClient, user.id, taskConfig.tier);
    if (!budgetOk) {
      return errorResponse(429, 'Daily AI budget exceeded', 'BUDGET_EXCEEDED');
    }

    // Cache check
    const cacheKey = makeCacheKey(TASK_TYPE, input);
    const cached = await getCached(serviceClient, cacheKey);
    if (cached) {
      return jsonResponse({
        content: JSON.stringify(cached),
        structured: cached,
        tokensUsed: 0,
        model: 'cache',
        latencyMs: 0,
        cached: true,
      });
    }

    // Call Anthropic
    const aiResult = await callAnthropic({
      tier: taskConfig.tier,
      maxTokens: taskConfig.maxTokens,
      system: buildSystemPrompt(TASK_TYPE),
      userMessage: buildUserPrompt(TASK_TYPE, input),
    });

    const validated = validateAIOutput(TASK_TYPE, aiResult.content);

    // Persist strategy to database
    if (input.claimId) {
      const strategyRow = {
        claim_id: input.claimId,
        recommended_action: validated.recommendation,
        action_description: validated.steps?.[0]?.action ?? '',
        claim_strength: validated.steps?.length ? Math.min(validated.steps.length * 20, 100) : 50,
        win_probability: 0.5,
        attention_items: [],
        escalation_ladder: (validated.steps ?? []).map((s: any, i: number) => ({
          order: s.order ?? i + 1,
          title: s.action,
          description: s.rationale,
          status: i === 0 ? 'active' : 'pending',
          date: null,
        })),
        ai_summary: validated.recommendation,
      };

      // Upsert strategy (one per claim)
      await supabase
        .from('strategies')
        .upsert(strategyRow, { onConflict: 'claim_id' });

      // Update claim strength
      const strengthLabel =
        strategyRow.claim_strength >= 70 ? 'high' :
        strategyRow.claim_strength >= 40 ? 'medium' : 'low';

      await supabase
        .from('claims')
        .update({
          strength: strategyRow.claim_strength,
          strength_label: strengthLabel,
        })
        .eq('id', input.claimId)
        .eq('user_id', user.id);
    }

    // Cache + log
    setCache(serviceClient, cacheKey, TASK_TYPE, validated, aiResult.tokensUsed, aiResult.model);
    logUsage(serviceClient, user.id, TASK_TYPE, taskConfig.tier, aiResult.tokensUsed, aiResult.model, aiResult.latencyMs, input.claimId);

    return jsonResponse({
      content: aiResult.content,
      structured: validated,
      tokensUsed: aiResult.tokensUsed,
      model: aiResult.model,
      latencyMs: aiResult.latencyMs,
      cached: false,
    });
  } catch (err: any) {
    console.error('ai-generate-strategy error:', err);
    return errorResponse(500, err.message ?? 'Strategy generation failed', 'AI_ERROR');
  }
});
