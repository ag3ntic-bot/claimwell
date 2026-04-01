const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDelete = jest.fn();

jest.mock('../client', () => {
  class ApiError extends Error {
    readonly statusCode: number | undefined;
    readonly code: string;
    readonly isNetworkError: boolean;

    constructor(opts: { message: string; statusCode?: number; code: string; isNetworkError?: boolean }) {
      super(opts.message);
      this.name = 'ApiError';
      this.statusCode = opts.statusCode;
      this.code = opts.code;
      this.isNetworkError = opts.isNetworkError ?? false;
    }

    static from(error: unknown): InstanceType<typeof ApiError> {
      if (error instanceof ApiError) return error;
      if (error instanceof Error) {
        return new ApiError({
          message: error.message,
          code: (error as unknown as Record<string, string>).code ?? 'UNKNOWN',
          isNetworkError: (error as unknown as Record<string, boolean>).isNetworkError ?? false,
          statusCode: (error as unknown as Record<string, number>).statusCode,
        });
      }
      return new ApiError({ message: String(error), code: 'UNKNOWN' });
    }
  }

  return {
    __esModule: true,
    apiClient: {
      get: (...args: unknown[]) => mockGet(...args),
      post: (...args: unknown[]) => mockPost(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
    },
    ApiError,
  };
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

import { fetchEvidence, uploadEvidence, deleteEvidence } from '../evidence';
import { ApiError } from '../client';
import { mockEvidence } from '@/testing/fixtures';

(globalThis as Record<string, unknown>).__DEV__ = true;

describe('evidence API', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetchEvidence returns data', async () => {
    mockGet.mockResolvedValueOnce({ data: mockEvidence });
    const result = await fetchEvidence('clm_01');
    expect(mockGet).toHaveBeenCalledWith('/claims-evidence', { params: { claimId: 'clm_01' } });
    expect(result).toEqual(mockEvidence);
  });

  it('fetchEvidence falls back on network error', async () => {
    mockGet.mockRejectedValueOnce(
      new ApiError({ message: 'Net', code: 'ERR_NETWORK', isNetworkError: true }),
    );
    const result = await fetchEvidence('clm_01');
    expect(result.length).toBeGreaterThan(0);
  });

  it('fetchEvidence throws on server error', async () => {
    mockGet.mockRejectedValueOnce(
      new ApiError({ message: 'Error', code: 'SERVER', statusCode: 500 }),
    );
    await expect(fetchEvidence('clm_01')).rejects.toThrow('Error');
  });

  it('uploadEvidence posts form data', async () => {
    const file = { uri: 'file:///photo.jpg', name: 'photo.jpg', type: 'image/jpeg' };
    mockPost.mockResolvedValueOnce({ data: { id: 'ev_new', fileName: 'photo.jpg' } });
    const result = await uploadEvidence('clm_01', file);
    expect(mockPost).toHaveBeenCalled();
    expect(result.fileName).toBe('photo.jpg');
  });

  it('deleteEvidence calls endpoint', async () => {
    mockDelete.mockResolvedValueOnce({ data: undefined });
    await deleteEvidence('ev_01');
    expect(mockDelete).toHaveBeenCalledWith('/evidence-delete', { params: { id: 'ev_01' } });
  });
});
