import { useQuery } from '@tanstack/react-query';
import type { Claim } from '@/types';
import { fetchClaim } from '@/services/api/claims';

export function useClaim(id: string | null | undefined) {
  return useQuery<Claim>({
    queryKey: ['claims', id],
    queryFn: () => fetchClaim(id!),
    enabled: !!id,
  });
}
