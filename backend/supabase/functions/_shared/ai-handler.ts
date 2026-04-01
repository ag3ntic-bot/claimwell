// deno-lint-ignore-file no-explicit-any
/**
 * Shared handler for all AI Edge Functions.
 * Each AI function just specifies its task type and calls this.
 */

import { handleCors } from './cors.ts';
import { getAuthUser } from './auth.ts';
import { createServiceClient } from './db.ts';
import { jsonResponse, errorResponse } from './response.ts';
import { callAnthropic } from './ai-client.ts';
import { checkBudget, logUsage } from './ai-budget.ts';
import { makeCacheKey, getCached, setCache } from './ai-cache.ts';
import { buildSystemPrompt, buildUserPrompt, AI_TASK_CONFIG } from './ai-prompts.ts';
import { validateAIOutput } from './ai-validation.ts';

export async function handleAIRequest(
  req: Request,
  taskType: string,
): Promise<Response> {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse(405, 'Method not allowed');
  }

  const { user, error: authError } = await getAuthUser(req);
  if (authError || !user) {
    return errorResponse(401, 'Unauthorized', 'AUTH_REQUIRED');
  }

  const taskConfig = AI_TASK_CONFIG[taskType];
  if (!taskConfig) {
    return errorResponse(400, `Unknown task type: ${taskType}`, 'INVALID_TASK');
  }

  try {
    const input = await req.json();
    const serviceClient = createServiceClient();

    // 1. Check budget
    const budgetOk = await checkBudget(serviceClient, user.id, taskConfig.tier);
    if (!budgetOk) {
      return errorResponse(429, 'Daily AI budget exceeded for this tier', 'BUDGET_EXCEEDED');
    }

    // 2. Check cache
    const cacheKey = makeCacheKey(taskType, input);
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

    // 3. Call Anthropic
    const systemPrompt = buildSystemPrompt(taskType);
    const userPrompt = buildUserPrompt(taskType, input);

    const aiResult = await callAnthropic({
      tier: taskConfig.tier,
      maxTokens: taskConfig.maxTokens,
      system: systemPrompt,
      userMessage: userPrompt,
    });

    // 4. Validate output
    const validated = validateAIOutput(taskType, aiResult.content);

    // 5. Cache result (fire and forget)
    setCache(serviceClient, cacheKey, taskType, validated, aiResult.tokensUsed, aiResult.model);

    // 6. Log usage (fire and forget)
    logUsage(
      serviceClient,
      user.id,
      taskType,
      taskConfig.tier,
      aiResult.tokensUsed,
      aiResult.model,
      aiResult.latencyMs,
      input.claimId,
    );

    // 7. Return response matching frontend AIOutput interface
    return jsonResponse({
      content: aiResult.content,
      structured: validated,
      tokensUsed: aiResult.tokensUsed,
      model: aiResult.model,
      latencyMs: aiResult.latencyMs,
      cached: false,
    });
  } catch (err: any) {
    console.error(`ai-${taskType} error:`, err);

    if (err.name === 'AIValidationError') {
      return errorResponse(422, err.message, 'AI_VALIDATION_ERROR');
    }

    return errorResponse(500, err.message ?? 'AI processing failed', 'AI_ERROR');
  }
}
