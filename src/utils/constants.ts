/**
 * Application-wide constants.
 */

/** Display name of the application. */
export const APP_NAME = 'Claimwell';

/** Maximum file size for uploads (10 MB). */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Supported image MIME types for evidence uploads. */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
] as const;

/** Supported document MIME types for evidence uploads. */
export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'text/html',
  'message/rfc822',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/** All supported MIME types for evidence uploads. */
export const SUPPORTED_FILE_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_DOCUMENT_TYPES,
] as const;

/** Default API request timeout in milliseconds (15 seconds). */
export const API_TIMEOUT = 15_000;

/** Maximum number of evidence items per claim. */
export const MAX_EVIDENCE_PER_CLAIM = 20;

/** Maximum number of draft versions stored per claim. */
export const MAX_DRAFTS_PER_CLAIM = 10;
