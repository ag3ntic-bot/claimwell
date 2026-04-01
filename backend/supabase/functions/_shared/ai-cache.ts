// deno-lint-ignore-file no-explicit-any

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate a deterministic cache key from task type and input.
 */
export function makeCacheKey(taskType: string, input: any): string {
  const raw = JSON.stringify({ taskType, ...input });
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return `${taskType}:${hash}`;
}

/**
 * Look up a cached AI result. Returns null on miss or expired entry.
 */
export async function getCached(
  serviceClient: any,
  cacheKey: string,
): Promise<any | null> {
  const { data, error } = await serviceClient
    .from('ai_cache')
    .select('result, expires_at')
    .eq('cache_key', cacheKey)
    .single();

  if (error || !data) return null;

  // Check expiration
  if (new Date(data.expires_at) < new Date()) {
    // Expired — clean up in background
    serviceClient.from('ai_cache').delete().eq('cache_key', cacheKey).then(() => {});
    return null;
  }

  return data.result;
}

/**
 * Store an AI result in the cache.
 */
export async function setCache(
  serviceClient: any,
  cacheKey: string,
  taskType: string,
  result: any,
  tokensUsed: number,
  model: string,
): Promise<void> {
  const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString();

  const { error } = await serviceClient.from('ai_cache').upsert(
    {
      cache_key: cacheKey,
      task_type: taskType,
      result,
      tokens_used: tokensUsed,
      model,
      expires_at: expiresAt,
    },
    { onConflict: 'cache_key' },
  );

  if (error) {
    console.warn('[AI Cache] Failed to cache result:', error.message);
  }
}
