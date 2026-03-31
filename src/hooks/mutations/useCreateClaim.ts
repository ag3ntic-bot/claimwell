import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Claim } from '@/types';
import { createClaim } from '@/services/api/claims';
import type { CreateClaimRequest } from '@/services/api/types';

export function useCreateClaim() {
  const queryClient = useQueryClient();

  return useMutation<Claim, Error, CreateClaimRequest>({
    mutationFn: (data) => createClaim(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}
