import type { AITask, AIInput, AIOutput } from '@/types';

export interface AIProvider {
  complete(task: AITask, input: AIInput): Promise<AIOutput>;
  stream?(task: AITask, input: AIInput): AsyncGenerator<string>;
}
