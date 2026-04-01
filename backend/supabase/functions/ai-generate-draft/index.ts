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

const TASK_TYPE = 'generate_draft';

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

    // Persist draft to database
    if (input.claimId) {
      // Count existing drafts for versioning
      const { count } = await supabase
        .from('drafts')
        .select('*', { count: 'exact', head: true })
        .eq('claim_id', input.claimId);

      const version = `${(count ?? 0) + 1}.0`;

      await supabase.from('drafts').insert({
        claim_id: input.claimId,
        tone: validated.tone ?? input.tone ?? 'assertive',
        version,
        content: validated.content,
        ai_reasoning: validated.reasoning ?? '',
        recipient_name: input.context?.recipientName ?? '',
        recipient_title: input.context?.recipientTitle ?? '',
        subject: input.context?.subject ?? '',
      });

      // Create timeline event
      await supabase.from('timeline_events').insert({
        claim_id: input.claimId,
        type: 'follow_up',
        title: 'Draft generated',
        description: `AI-generated ${validated.tone ?? 'assertive'} draft v${version}`,
      });
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
    console.error('ai-generate-draft error:', err);
    return errorResponse(500, err.message ?? 'Draft generation failed', 'AI_ERROR');
  }
});
