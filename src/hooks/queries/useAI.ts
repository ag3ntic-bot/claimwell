import { useQuery } from '@tanstack/react-query';

type AITaskFn<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

interface UseAITaskOptions<TInput> {
  taskKey: string;
  input: TInput;
  enabled?: boolean;
  staleTime?: number;
}

export function useAITask<TInput, TOutput>(
  taskFn: AITaskFn<TInput, TOutput>,
  options: UseAITaskOptions<TInput>,
) {
  const { taskKey, input, enabled = true, staleTime = 5 * 60 * 1000 } = options;

  return useQuery<TOutput>({
    queryKey: ['ai', taskKey, input],
    queryFn: () => taskFn(input),
    enabled,
    staleTime,
    retry: 1,
  });
}
