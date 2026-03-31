import type { ClaimCategory, ClaimStatus, EvidenceType } from '@/types';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Shape of error responses from the API server. */
export interface ApiErrorResponse {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface CreateClaimRequest {
  title: string;
  category: ClaimCategory;
  companyName: string;
  description: string;
  amountClaimed: number;
  policyNumber?: string | null;
  serialNumber?: string | null;
}

export interface UpdateClaimRequest {
  title?: string;
  category?: ClaimCategory;
  companyName?: string;
  description?: string;
  amountClaimed?: number;
  status?: ClaimStatus;
  policyNumber?: string | null;
  serialNumber?: string | null;
}

export interface UploadEvidenceRequest {
  claimId: string;
  file: {
    uri: string;
    name: string;
    type: string;
  };
  evidenceType: EvidenceType;
  title: string;
}
