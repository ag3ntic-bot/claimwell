export { apiClient, ApiError } from './client';
export { fetchClaims, fetchClaim, createClaim, updateClaim, fetchClaimSummary } from './claims';
export { fetchEvidence, uploadEvidence, deleteEvidence } from './evidence';
export { fetchTemplates, fetchTemplate, searchTemplates } from './templates';
export { fetchProfile, updateProfile, fetchSettings, updateSettings } from './user';
export type {
  PaginatedResponse,
  ApiErrorResponse,
  CreateClaimRequest,
  UpdateClaimRequest,
  UploadEvidenceRequest,
} from './types';
