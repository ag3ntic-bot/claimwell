export type TimelineEventType =
  | 'claim_created'
  | 'evidence_uploaded'
  | 'email_sent'
  | 'response_received'
  | 'denial_received'
  | 'appeal_sent'
  | 'follow_up'
  | 'support_contact'
  | 'resolved';

export interface TimelineEvent {
  id: string;
  claimId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: string;
  attachmentFileName: string | null;
  attachmentUri: string | null;
  attachmentIcon: string | null;
}

export const TIMELINE_EVENT_META: Record<
  TimelineEventType,
  { icon: string; color: 'primary' | 'error' | 'tertiary' | 'surface' }
> = {
  claim_created: { icon: 'receipt_long', color: 'primary' },
  evidence_uploaded: { icon: 'photo_library', color: 'primary' },
  email_sent: { icon: 'draft', color: 'primary' },
  response_received: { icon: 'mail', color: 'tertiary' },
  denial_received: { icon: 'mail', color: 'error' },
  appeal_sent: { icon: 'send', color: 'primary' },
  follow_up: { icon: 'draft', color: 'primary' },
  support_contact: { icon: 'forum', color: 'surface' },
  resolved: { icon: 'check_circle', color: 'primary' },
};
