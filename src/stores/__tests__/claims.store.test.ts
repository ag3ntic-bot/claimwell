import { useClaimsStore } from '../claims.store';

describe('useClaimsStore', () => {
  beforeEach(() => {
    useClaimsStore.setState({
      selectedClaimId: null,
      filterStatus: 'all',
      searchQuery: '',
    });
  });

  it('has correct initial state', () => {
    const state = useClaimsStore.getState();
    expect(state.selectedClaimId).toBeNull();
    expect(state.filterStatus).toBe('all');
    expect(state.searchQuery).toBe('');
  });

  it('setSelectedClaim updates selectedClaimId', () => {
    useClaimsStore.getState().setSelectedClaim('clm_01');
    expect(useClaimsStore.getState().selectedClaimId).toBe('clm_01');
  });

  it('setSelectedClaim can be set to null', () => {
    useClaimsStore.getState().setSelectedClaim('clm_01');
    useClaimsStore.getState().setSelectedClaim(null);
    expect(useClaimsStore.getState().selectedClaimId).toBeNull();
  });

  it('setFilter updates filterStatus', () => {
    useClaimsStore.getState().setFilter('appealing');
    expect(useClaimsStore.getState().filterStatus).toBe('appealing');
  });

  it('setFilter can set to "all"', () => {
    useClaimsStore.getState().setFilter('resolved');
    useClaimsStore.getState().setFilter('all');
    expect(useClaimsStore.getState().filterStatus).toBe('all');
  });

  it('setSearch updates searchQuery', () => {
    useClaimsStore.getState().setSearch('iPhone');
    expect(useClaimsStore.getState().searchQuery).toBe('iPhone');
  });

  it('setSearch can clear the query', () => {
    useClaimsStore.getState().setSearch('iPhone');
    useClaimsStore.getState().setSearch('');
    expect(useClaimsStore.getState().searchQuery).toBe('');
  });
});
