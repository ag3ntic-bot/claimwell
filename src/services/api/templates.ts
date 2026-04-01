import type { Template } from '@/types';
import { mockTemplates } from '@/testing/fixtures';
import { apiClient, ApiError } from './client';

export async function fetchTemplates(): Promise<Template[]> {
  try {
    const response = await apiClient.get<Template[]>('/templates');
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      return mockTemplates;
    }
    throw apiError;
  }
}

export async function fetchTemplate(id: string): Promise<Template> {
  try {
    const response = await apiClient.get<Template>('/templates', { params: { id } });
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      const template = mockTemplates.find((t) => t.id === id);
      if (!template) throw new ApiError({ message: `Template ${id} not found`, code: 'NOT_FOUND', statusCode: 404 });
      return template;
    }
    throw apiError;
  }
}

export async function searchTemplates(query: string): Promise<Template[]> {
  try {
    const response = await apiClient.get<Template[]>('/templates-search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    const apiError = ApiError.from(error);
    if (__DEV__ && apiError.isNetworkError) {
      const lower = query.toLowerCase();
      return mockTemplates.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(lower)),
      );
    }
    throw apiError;
  }
}
