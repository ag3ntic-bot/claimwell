import type { Evidence } from '@/types';
import { mockEvidence } from '@/testing/fixtures';
import { apiClient, ApiError } from './client';
import type { UploadEvidenceRequest } from './types';

export async function fetchEvidence(claimId: string): Promise<Evidence[]> {
  try {
    const response = await apiClient.get<Evidence[]>('/claims-evidence', {
      params: { claimId },
    });
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      return mockEvidence.filter((e) => e.claimId === claimId);
    }
    throw apiError;
  }
}

export async function uploadEvidence(
  claimId: string,
  file: UploadEvidenceRequest['file'],
): Promise<Evidence> {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
    formData.append('claimId', claimId);

    const response = await apiClient.post<Evidence>('/claims-evidence', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { claimId },
    });
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      const newEvidence: Evidence = {
        id: `ev_${Date.now()}`,
        claimId,
        type: 'document',
        title: file.name,
        fileName: file.name,
        uri: file.uri,
        thumbnailUri: null,
        flags: [],
        aiSummary: null,
        extractedData: null,
        uploadedAt: new Date().toISOString(),
        fileSize: 0,
        mimeType: file.type,
      };
      return newEvidence;
    }
    throw apiError;
  }
}

export async function deleteEvidence(id: string): Promise<void> {
  try {
    await apiClient.delete('/evidence-delete', { params: { id } });
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      return;
    }
    throw apiError;
  }
}
