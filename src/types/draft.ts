export type DraftTone = 'calm' | 'assertive' | 'formal';

export interface Draft {
  id: string;
  claimId: string;
  tone: DraftTone;
  version: string;
  content: string;
  aiReasoning: string;
  recipientName: string;
  recipientTitle: string;
  subject: string;
  generatedAt: string;
}

export const DRAFT_TONE_META: Record<DraftTone, { label: string; description: string }> = {
  calm: {
    label: 'Calm',
    description: 'Measured and diplomatic tone that maintains rapport',
  },
  assertive: {
    label: 'Assertive',
    description: 'Direct and confident tone that demands resolution',
  },
  formal: {
    label: 'Formal',
    description: 'Professional legal-style tone for escalation',
  },
};
