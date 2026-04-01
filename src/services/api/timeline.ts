import type { TimelineEvent } from '@/types';
import { apiClient, ApiError, USE_REAL_BACKEND } from './client';

export async function fetchTimeline(claimId: string): Promise<TimelineEvent[]> {
  try {
    const response = await apiClient.get<TimelineEvent[]>('/claims-timeline', {
      params: { claimId },
    });
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && !USE_REAL_BACKEND && apiError.isNetworkError) {
      return [];
    }
    throw apiError;
  }
}
