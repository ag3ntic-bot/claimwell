import { create } from 'zustand';
import type { ClaimStatus } from '@/types';

interface ClaimsState {
  selectedClaimId: string | null;
  filterStatus: ClaimStatus | 'all';
  searchQuery: string;
  setSelectedClaim: (id: string | null) => void;
  setFilter: (status: ClaimStatus | 'all') => void;
  setSearch: (query: string) => void;
}

export const useClaimsStore = create<ClaimsState>((set) => ({
  selectedClaimId: null,
  filterStatus: 'all',
  searchQuery: '',

  setSelectedClaim: (id) => set({ selectedClaimId: id }),
  setFilter: (status) => set({ filterStatus: status }),
  setSearch: (query) => set({ searchQuery: query }),
}));
