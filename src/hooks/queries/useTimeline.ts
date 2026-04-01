import { useQuery } from '@tanstack/react-query';
import type { TimelineEvent } from '@/types';
import { fetchTimeline } from '@/services/api/timeline';

export function useTimeline(claimId: string | null | undefined) {
  return useQuery<TimelineEvent[]>({
    queryKey: ['timeline', claimId],
    queryFn: () => fetchTimeline(claimId!),
    enabled: !!claimId,
  });
}
