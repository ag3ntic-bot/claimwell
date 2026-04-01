import type { User, AppSettings } from '@/types';
import { mockUser, mockSettings } from '@/testing/fixtures';
import { apiClient, ApiError, USE_REAL_BACKEND } from './client';

export async function fetchProfile(): Promise<User> {
  try {
    const response = await apiClient.get<User>('/user-profile');
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && !USE_REAL_BACKEND && apiError.isNetworkError) {
      return mockUser;
    }
    throw apiError;
  }
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  try {
    const response = await apiClient.patch<User>('/user-profile', data);
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && !USE_REAL_BACKEND && apiError.isNetworkError) {
      return { ...mockUser, ...data };
    }
    throw apiError;
  }
}

export async function fetchSettings(): Promise<AppSettings> {
  try {
    const response = await apiClient.get<AppSettings>('/user-settings');
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && !USE_REAL_BACKEND && apiError.isNetworkError) {
      return mockSettings;
    }
    throw apiError;
  }
}

export async function updateSettings(data: Partial<AppSettings>): Promise<AppSettings> {
  try {
    const response = await apiClient.patch<AppSettings>('/user-settings', data);
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && !USE_REAL_BACKEND && apiError.isNetworkError) {
      return { ...mockSettings, ...data };
    }
    throw apiError;
  }
}
