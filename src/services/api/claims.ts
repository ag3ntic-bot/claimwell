import type { Claim, ClaimSummary } from '@/types';
import { mockClaims, mockClaimSummary } from '@/testing/fixtures';
import { apiClient, ApiError } from './client';
import type { CreateClaimRequest, UpdateClaimRequest, PaginatedResponse } from './types';

export async function fetchClaims(): Promise<Claim[]> {
  try {
    const response = await apiClient.get<PaginatedResponse<Claim>>('/claims');
    return response.data.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      return mockClaims;
    }
    throw apiError;
  }
}

export async function fetchClaim(id: string): Promise<Claim> {
  try {
    const response = await apiClient.get<Claim>('/claims-by-id', { params: { id } });
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      const claim = mockClaims.find((c) => c.id === id);
      if (!claim) throw new ApiError({ message: `Claim ${id} not found`, code: 'NOT_FOUND', statusCode: 404 });
      return claim;
    }
    throw apiError;
  }
}

export async function createClaim(data: CreateClaimRequest): Promise<Claim> {
  try {
    const response = await apiClient.post<Claim>('/claims', data);
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      const newClaim: Claim = {
        id: `clm_${Date.now()}`,
        userId: 'usr_01',
        title: data.title,
        category: data.category,
        companyName: data.companyName,
        status: 'draft',
        strength: 0,
        strengthLabel: 'low',
        amountClaimed: data.amountClaimed,
        amountRecovered: null,
        resolutionProgress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resolvedAt: null,
        caseId: `#CLW-${Math.floor(Math.random() * 100000)}`,
        description: data.description,
        policyNumber: data.policyNumber ?? null,
        serialNumber: data.serialNumber ?? null,
      };
      return newClaim;
    }
    throw apiError;
  }
}

export async function updateClaim(id: string, data: UpdateClaimRequest): Promise<Claim> {
  try {
    const response = await apiClient.patch<Claim>('/claims-by-id', data, { params: { id } });
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      const existing = mockClaims.find((c) => c.id === id);
      if (!existing) throw new ApiError({ message: `Claim ${id} not found`, code: 'NOT_FOUND', statusCode: 404 });
      return { ...existing, ...data, updatedAt: new Date().toISOString() } as Claim;
    }
    throw apiError;
  }
}

export async function fetchClaimSummary(): Promise<ClaimSummary> {
  try {
    const response = await apiClient.get<ClaimSummary>('/claims-summary');
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      return mockClaimSummary;
    }
    throw apiError;
  }
}
