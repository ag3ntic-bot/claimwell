import { useQuery } from '@tanstack/react-query';
import type { Claim, ClaimStatus, ClaimSummary } from '@/types';
import { fetchClaims, fetchClaimSummary } from '@/services/api/claims';
import { useClaimsStore } from '@/stores/claims.store';

export function useClaims() {
  const filterStatus = useClaimsStore((s) => s.filterStatus);

  return useQuery<Claim[]>({
    queryKey: ['claims', filterStatus],
    queryFn: async () => {
      const claims = await fetchClaims();
      if (filterStatus === 'all') return claims;
      return claims.filter((c) => c.status === filterStatus);
    },
  });
}

export function useClaimSummary() {
  return useQuery<ClaimSummary>({
    queryKey: ['claims', 'summary'],
    queryFn: fetchClaimSummary,
  });
}

export function useFilteredClaims() {
  const filterStatus = useClaimsStore((s) => s.filterStatus);
  const searchQuery = useClaimsStore((s) => s.searchQuery);

  return useQuery<Claim[]>({
    queryKey: ['claims', filterStatus, searchQuery],
    queryFn: async () => {
      const claims = await fetchClaims();
      let filtered = claims;

      if (filterStatus !== 'all') {
        filtered = filtered.filter((c) => c.status === (filterStatus as ClaimStatus));
      }

      if (searchQuery.trim()) {
        const lower = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(lower) ||
            c.companyName.toLowerCase().includes(lower) ||
            c.caseId.toLowerCase().includes(lower),
        );
      }

      return filtered;
    },
  });
}
