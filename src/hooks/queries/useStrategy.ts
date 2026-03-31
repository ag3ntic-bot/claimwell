import { useQuery } from '@tanstack/react-query';
import type { AIStrategy } from '@/types';
import { generateStrategy } from '@/services/ai/tasks/generate-strategy';
import { useClaim } from './useClaim';
import { useEvidence } from './useEvidence';

export function useStrategy(claimId: string | null | undefined) {
  const { data: claim } = useClaim(claimId);
  const { data: evidence } = useEvidence(claimId);

  return useQuery<AIStrategy>({
    queryKey: ['strategy', claimId],
    queryFn: () => {
      const claimDetails: Record<string, unknown> = {
        id: claim!.id,
        title: claim!.title,
        category: claim!.category,
        companyName: claim!.companyName,
        status: claim!.status,
        description: claim!.description,
        amountClaimed: claim!.amountClaimed,
      };

      const context: Record<string, unknown> = {
        evidenceCount: evidence?.length ?? 0,
        evidenceSummaries: evidence?.map((e) => e.aiSummary).filter(Boolean) ?? [],
      };

      return generateStrategy(claimDetails, context);
    },
    enabled: !!claim && !!evidence,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
