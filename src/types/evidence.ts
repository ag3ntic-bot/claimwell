export type EvidenceType = 'photo' | 'receipt' | 'email' | 'chat_log' | 'document' | 'pdf' | 'other';

export type EvidenceFlag = 'key_evidence' | 'contradiction' | 'missing_info' | 'ai_verified';

export interface Evidence {
  id: string;
  claimId: string;
  type: EvidenceType;
  title: string;
  fileName: string;
  uri: string;
  thumbnailUri: string | null;
  flags: EvidenceFlag[];
  aiSummary: string | null;
  extractedData: Record<string, string | number> | null;
  uploadedAt: string;
  fileSize: number;
  mimeType: string;
}

export const EVIDENCE_TYPE_META: Record<
  EvidenceType,
  { label: string; icon: string }
> = {
  photo: { label: 'Photo', icon: 'photo_library' },
  receipt: { label: 'Receipt', icon: 'receipt_long' },
  email: { label: 'Email', icon: 'mail' },
  chat_log: { label: 'Chat Log', icon: 'forum' },
  document: { label: 'Document', icon: 'description' },
  pdf: { label: 'PDF', icon: 'picture_as_pdf' },
  other: { label: 'Other', icon: 'attach_file' },
};

export const EVIDENCE_FLAG_META: Record<
  EvidenceFlag,
  { label: string; variant: 'primary' | 'error' | 'tertiary' }
> = {
  key_evidence: { label: 'Key Evidence', variant: 'primary' },
  contradiction: { label: 'Contradiction', variant: 'error' },
  missing_info: { label: 'Missing Info', variant: 'tertiary' },
  ai_verified: { label: 'AI Verified', variant: 'primary' },
};
