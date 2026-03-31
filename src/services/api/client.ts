import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from '@/services/storage/secure';

const BASE_URL = __DEV__ ? 'http://localhost:3000' : 'https://api.claimwell.app';

// ---------------------------------------------------------------------------
// Typed API Error
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  readonly statusCode: number | undefined;
  readonly code: string;
  readonly isNetworkError: boolean;
  readonly details: Record<string, unknown> | undefined;

  constructor(options: {
    message: string;
    statusCode?: number;
    code: string;
    isNetworkError?: boolean;
    details?: Record<string, unknown>;
    cause?: unknown;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.isNetworkError = options.isNetworkError ?? false;
    this.details = options.details;
    if (options.cause) {
      this.cause = options.cause;
    }
  }

  /** True when the server returned a 5xx status code. */
  get isServerError(): boolean {
    return this.statusCode != null && this.statusCode >= 500;
  }

  /** True when the server returned a 4xx status code. */
  get isClientError(): boolean {
    return this.statusCode != null && this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Narrow an unknown error into an ApiError.
   * If it is already an ApiError it is returned as-is.
   * AxiosErrors are converted; everything else becomes a generic ApiError.
   */
  static from(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<{ message?: string; code?: string; details?: Record<string, unknown> }>;
      const data = axiosErr.response?.data;
      return new ApiError({
        message: data?.message ?? axiosErr.message ?? 'Request failed',
        statusCode: axiosErr.response?.status,
        code: data?.code ?? axiosErr.code ?? 'UNKNOWN',
        isNetworkError: !axiosErr.response,
        details: data?.details,
        cause: error,
      });
    }

    if (error instanceof Error) {
      return new ApiError({
        message: error.message,
        code: 'UNKNOWN',
        isNetworkError: false,
        cause: error,
      });
    }

    return new ApiError({
      message: String(error),
      code: 'UNKNOWN',
      isNetworkError: false,
    });
  }
}

// ---------------------------------------------------------------------------
// Axios Instance
// ---------------------------------------------------------------------------

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Auth request interceptor - attach Bearer token
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use(
  async (config) => {
    const token = await secureStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// DEV-mode request/response logging
// ---------------------------------------------------------------------------

if (__DEV__) {
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`[API] --> ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.log('[API] --> Request error:', error);
      return Promise.reject(error);
    },
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log(`[API] <-- ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      if (axios.isAxiosError(error)) {
        console.log(
          `[API] <-- ${error.response?.status ?? 'NETWORK'} ${error.config?.url} - ${error.message}`,
        );
      }
      return Promise.reject(error);
    },
  );
}

// ---------------------------------------------------------------------------
// Response interceptor - handle 401
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await secureStorage.clearAll();
    }
    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Retry interceptor (3 retries for 5xx / network errors, exponential backoff)
// ---------------------------------------------------------------------------

const RETRY_COUNT = 3;
const RETRY_BASE_DELAY = 300; // ms

interface RetryConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

function shouldRetry(error: AxiosError): boolean {
  // Never retry on 4xx
  if (error.response && error.response.status >= 400 && error.response.status < 500) {
    return false;
  }
  // Retry on 5xx
  if (error.response && error.response.status >= 500) {
    return true;
  }
  // Retry on network errors (no response)
  if (!error.response) {
    return true;
  }
  return false;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetryConfig | undefined;

  if (!config || !shouldRetry(error)) {
    return Promise.reject(error);
  }

  const retryCount = config.__retryCount ?? 0;

  if (retryCount >= RETRY_COUNT) {
    return Promise.reject(error);
  }

  config.__retryCount = retryCount + 1;

  const backoff = RETRY_BASE_DELAY * Math.pow(2, retryCount); // 300, 600, 1200

  if (__DEV__) {
    console.log(
      `[API] Retry ${config.__retryCount}/${RETRY_COUNT} after ${backoff}ms for ${config.url}`,
    );
  }

  await delay(backoff);

  return apiClient(config);
});
