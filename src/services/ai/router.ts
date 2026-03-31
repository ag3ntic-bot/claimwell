import type { AITask, AIInput, AIOutput, AITier } from '@/types';
import { AI_TASK_CONFIG } from '@/types';
import type { AIProvider } from './providers/types';
import { MockAIProvider } from './providers/mock';
import { AnthropicProvider } from './providers/anthropic';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashInput(taskType: string, input: AIInput): string {
  const key = JSON.stringify({ taskType, ...input });
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `${taskType}:${hash}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Retry configuration ────────────────────────────────────────────────────

interface RetryConfig {
  /** Max retries per tier. Default: tier 1/2 = 2, tier 3 = 1 */
  maxRetries: Record<AITier, number>;
  /** Base delay in ms for exponential backoff. Default: 200 */
  baseDelayMs: number;
  /** Whether tier-3 failures should fall back to tier 2. Default: true */
  tier3FallbackToTier2: boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: { 1: 2, 2: 2, 3: 1 },
  baseDelayMs: 200,
  tier3FallbackToTier2: true,
};

// ─── Token budget tracking ──────────────────────────────────────────────────

interface TierBudget {
  limit: number;
  used: number;
  resetAt: number; // epoch ms – start of the current budget window
}

interface BudgetConfig {
  /** Daily token limit per tier. 0 = unlimited. */
  dailyLimits: Record<AITier, number>;
  /** Fraction of budget at which a warning is logged. Default: 0.8 */
  warningThreshold: number;
}

const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  dailyLimits: { 1: 500_000, 2: 300_000, 3: 100_000 },
  warningThreshold: 0.8,
};

export class BudgetExceededError extends Error {
  constructor(tier: AITier, used: number, limit: number) {
    super(
      `Token budget exceeded for tier ${tier}: ${used}/${limit} tokens used. ` +
        'Wait for the daily budget to reset or increase the limit.',
    );
    this.name = 'BudgetExceededError';
  }
}

// ─── Observability hook ─────────────────────────────────────────────────────

export interface AIObserver {
  onRequestStart?(taskType: string, tier: AITier): void;
  onRequestEnd?(taskType: string, tier: AITier, output: AIOutput): void;
  onRetry?(taskType: string, tier: AITier, attempt: number, error: unknown): void;
  onFallback?(taskType: string, fromTier: AITier, toTier: AITier): void;
  onBudgetWarning?(tier: AITier, used: number, limit: number): void;
  onError?(taskType: string, tier: AITier, error: unknown): void;
}

// ─── AIRouter ───────────────────────────────────────────────────────────────

class AIRouter {
  private provider: AIProvider;
  private cache = new Map<string, { output: AIOutput; timestamp: number }>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  private retryConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG };
  private budgetConfig: BudgetConfig = { ...DEFAULT_BUDGET_CONFIG };
  private budgets = new Map<AITier, TierBudget>();
  private observers: AIObserver[] = [];

  constructor() {
    this.provider = __DEV__ ? new MockAIProvider() : new AnthropicProvider();
  }

  // ── Provider management ──────────────────────────────────────────────────

  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  // ── Configuration ────────────────────────────────────────────────────────

  configureRetry(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  configureBudget(config: Partial<BudgetConfig>): void {
    this.budgetConfig = { ...this.budgetConfig, ...config };
  }

  addObserver(observer: AIObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: AIObserver): void {
    const idx = this.observers.indexOf(observer);
    if (idx !== -1) this.observers.splice(idx, 1);
  }

  // ── Budget helpers ───────────────────────────────────────────────────────

  private getOrCreateBudget(tier: AITier): TierBudget {
    const now = Date.now();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const dayStart = startOfDay.getTime();

    let budget = this.budgets.get(tier);
    if (!budget || budget.resetAt < dayStart) {
      budget = {
        limit: this.budgetConfig.dailyLimits[tier],
        used: 0,
        resetAt: dayStart,
      };
      this.budgets.set(tier, budget);
    }
    return budget;
  }

  private checkBudget(tier: AITier): void {
    const budget = this.getOrCreateBudget(tier);
    if (budget.limit <= 0) return; // unlimited

    if (budget.used >= budget.limit) {
      throw new BudgetExceededError(tier, budget.used, budget.limit);
    }
  }

  private recordTokens(tier: AITier, tokens: number): void {
    const budget = this.getOrCreateBudget(tier);
    if (budget.limit <= 0) return;

    budget.used += tokens;

    const ratio = budget.used / budget.limit;
    if (ratio >= this.budgetConfig.warningThreshold && ratio - tokens / budget.limit < this.budgetConfig.warningThreshold) {
      console.warn(
        `[AI Budget] Tier ${tier} approaching limit: ${budget.used}/${budget.limit} ` +
          `(${(ratio * 100).toFixed(1)}%)`,
      );
      for (const obs of this.observers) {
        obs.onBudgetWarning?.(tier, budget.used, budget.limit);
      }
    }
  }

  /** Get current budget usage for a tier (useful for UI display). */
  getBudgetUsage(tier: AITier): { used: number; limit: number; remaining: number } {
    const budget = this.getOrCreateBudget(tier);
    return {
      used: budget.used,
      limit: budget.limit,
      remaining: Math.max(0, budget.limit - budget.used),
    };
  }

  resetBudget(tier?: AITier): void {
    if (tier) {
      this.budgets.delete(tier);
    } else {
      this.budgets.clear();
    }
  }

  // ── Observer dispatch helpers ────────────────────────────────────────────

  private notify<K extends keyof AIObserver>(
    method: K,
    ...args: Parameters<NonNullable<AIObserver[K]>>
  ): void {
    for (const obs of this.observers) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obs[method] as any)?.(...args);
      } catch {
        // Observer errors must not break the request pipeline
      }
    }
  }

  // ── Core completion with retry + fallback ────────────────────────────────

  async complete(taskType: string, input: AIInput): Promise<AIOutput> {
    const task = this.resolveTask(taskType);

    // Check cache first
    const cacheKey = hashInput(taskType, input);
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return { ...cached.output, cached: true };
    }

    // Check budget
    this.checkBudget(task.tier);

    this.notify('onRequestStart', taskType, task.tier);

    let output: AIOutput;
    try {
      output = await this.executeWithRetry(task, input, taskType);
    } catch (primaryError) {
      // Tier-3 fallback to tier-2
      if (task.tier === 3 && this.retryConfig.tier3FallbackToTier2) {
        console.warn(
          `[AI Router] Tier 3 failed for "${taskType}", falling back to tier 2.`,
          primaryError,
        );
        this.notify('onFallback', taskType, 3 as AITier, 2 as AITier);

        const fallbackTask: AITask = { ...task, tier: 2 };
        try {
          this.checkBudget(2);
          output = await this.executeWithRetry(fallbackTask, input, taskType);
        } catch (fallbackError) {
          this.notify('onError', taskType, 2 as AITier, fallbackError);
          throw fallbackError;
        }
      } else {
        this.notify('onError', taskType, task.tier, primaryError);
        throw primaryError;
      }
    }

    // Track tokens
    this.recordTokens(task.tier, output.tokensUsed);

    // Cache result
    this.cache.set(cacheKey, { output, timestamp: Date.now() });

    this.notify('onRequestEnd', taskType, task.tier, output);

    return output;
  }

  private async executeWithRetry(
    task: AITask,
    input: AIInput,
    taskType: string,
  ): Promise<AIOutput> {
    const maxRetries = this.retryConfig.maxRetries[task.tier] ?? 1;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.provider.complete(task, input);
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          const delayMs = this.retryConfig.baseDelayMs * Math.pow(2, attempt);
          console.warn(
            `[AI Router] Retry ${attempt + 1}/${maxRetries} for "${taskType}" ` +
              `(tier ${task.tier}) after ${delayMs}ms`,
            error,
          );
          this.notify('onRetry', taskType, task.tier, attempt + 1, error);
          await sleep(delayMs);
        }
      }
    }

    throw lastError;
  }

  // ── Streaming ────────────────────────────────────────────────────────────

  async *stream(taskType: string, input: AIInput): AsyncGenerator<string> {
    const task = this.resolveTask(taskType);

    if (!this.provider.stream) {
      throw new Error(`Provider does not support streaming for task: ${taskType}`);
    }

    this.checkBudget(task.tier);

    yield* this.provider.stream(task, input);
  }

  // ── Cache ────────────────────────────────────────────────────────────────

  clearCache(): void {
    this.cache.clear();
  }

  // ── Task resolution ──────────────────────────────────────────────────────

  getTaskConfig(taskType: string): AITask {
    return this.resolveTask(taskType);
  }

  private resolveTask(taskType: string): AITask {
    const task = AI_TASK_CONFIG[taskType as keyof typeof AI_TASK_CONFIG];
    if (!task) {
      throw new Error(`Unknown AI task type: ${taskType}`);
    }
    return task;
  }
}

export const aiRouter = new AIRouter();
