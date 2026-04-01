const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPatch = jest.fn();

// Mock the API client fully — avoid importing axios in tests
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

    get isServerError() {
      return this.statusCode != null && this.statusCode >= 500;
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
      patch: (...args: unknown[]) => mockPatch(...args),
    },
    ApiError,
  };
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

import { fetchClaims, fetchClaim, createClaim, fetchClaimSummary } from '../claims';
import { ApiError } from '../client';
import { mockClaims, mockClaimSummary } from '@/testing/fixtures';

(globalThis as Record<string, unknown>).__DEV__ = true;

describe('claims API service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('fetchClaims', () => {
    it('returns claims on success', async () => {
      mockGet.mockResolvedValueOnce({
        data: { data: mockClaims, total: mockClaims.length, page: 1, pageSize: 20, hasMore: false },
      });
      const result = await fetchClaims();
      expect(mockGet).toHaveBeenCalledWith('/claims');
      expect(result).toEqual(mockClaims);
    });

    it('falls back on network error in dev', async () => {
      mockGet.mockRejectedValueOnce(
        new ApiError({ message: 'Net', code: 'ERR_NETWORK', isNetworkError: true }),
      );
      const result = await fetchClaims();
      expect(result).toEqual(mockClaims);
    });

    it('throws on server error', async () => {
      mockGet.mockRejectedValueOnce(
        new ApiError({ message: 'Server Error', code: 'SERVER', statusCode: 500 }),
      );
      await expect(fetchClaims()).rejects.toThrow('Server Error');
    });
  });

  describe('fetchClaim', () => {
    it('returns claim by id', async () => {
      const claim = mockClaims[0];
      mockGet.mockResolvedValueOnce({ data: claim });
      const result = await fetchClaim(claim.id);
      expect(result).toEqual(claim);
    });

    it('falls back on network error', async () => {
      mockGet.mockRejectedValueOnce(
        new ApiError({ message: 'Net', code: 'ERR_NETWORK', isNetworkError: true }),
      );
      const result = await fetchClaim(mockClaims[0].id);
      expect(result.id).toBe(mockClaims[0].id);
    });

    it('throws for nonexistent claim', async () => {
      mockGet.mockRejectedValueOnce(
        new ApiError({ message: 'Net', code: 'ERR_NETWORK', isNetworkError: true }),
      );
      await expect(fetchClaim('clm_nonexistent')).rejects.toThrow();
    });
  });

  describe('createClaim', () => {
    it('sends payload', async () => {
      const payload = {
        title: 'Test',
        category: 'refund' as const,
        companyName: 'Co',
        description: 'Test desc.',
        amountClaimed: 500,
      };
      mockPost.mockResolvedValueOnce({ data: { ...payload, id: 'clm_new', status: 'draft' } });
      const result = await createClaim(payload);
      expect(mockPost).toHaveBeenCalledWith('/claims', payload);
      expect(result.title).toBe('Test');
    });
  });

  describe('fetchClaimSummary', () => {
    it('returns summary', async () => {
      mockGet.mockResolvedValueOnce({ data: mockClaimSummary });
      const result = await fetchClaimSummary();
      expect(result).toEqual(mockClaimSummary);
    });

    it('falls back on network error', async () => {
      mockGet.mockRejectedValueOnce(
        new ApiError({ message: 'Net', code: 'ERR_NETWORK', isNetworkError: true }),
      );
      const result = await fetchClaimSummary();
      expect(result).toEqual(mockClaimSummary);
    });
  });
});
