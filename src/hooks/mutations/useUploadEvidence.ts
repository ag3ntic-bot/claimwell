import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Evidence } from '@/types';
import { uploadEvidence } from '@/services/api/evidence';
import type { UploadEvidenceRequest } from '@/services/api/types';

export function useUploadEvidence(claimId: string) {
  const queryClient = useQueryClient();

  return useMutation<Evidence, Error, UploadEvidenceRequest['file']>({
    mutationFn: (file) => uploadEvidence(claimId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence', claimId] });
    },
  });
}
