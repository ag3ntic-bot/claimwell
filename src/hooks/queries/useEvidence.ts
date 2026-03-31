import { useQuery } from '@tanstack/react-query';
import type { Evidence } from '@/types';
import { fetchEvidence } from '@/services/api/evidence';

export function useEvidence(claimId: string | null | undefined) {
  return useQuery<Evidence[]>({
    queryKey: ['evidence', claimId],
    queryFn: () => fetchEvidence(claimId!),
    enabled: !!claimId,
  });
}
