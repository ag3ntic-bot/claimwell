import { useMutation } from '@tanstack/react-query';
import type { AIDraft } from '@/types';
import { generateDraft } from '@/services/ai/tasks/generate-draft';

interface GenerateDraftInput {
  claimDetails: Record<string, unknown>;
  tone: string;
  context: Record<string, unknown>;
}

export function useGenerateDraft() {
  return useMutation<AIDraft, Error, GenerateDraftInput>({
    mutationFn: ({ claimDetails, tone, context }) => generateDraft(claimDetails, tone, context),
  });
}
