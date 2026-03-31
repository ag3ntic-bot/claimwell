import type { TimelineEvent } from '@/types';

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'tl_01',
    claimId: 'clm_01',
    type: 'claim_created',
    title: 'Device Purchased',
    description:
      'iPhone 15 Pro Max (256GB, Natural Titanium) purchased from Apple Fifth Avenue for $1,199.00. One-year Apple Limited Warranty coverage began.',
    date: '2024-10-12T09:30:00Z',
    attachmentFileName: 'apple_receipt_oct2024.pdf',
    attachmentUri: 'file:///evidence/apple_receipt_oct2024.pdf',
    attachmentIcon: 'receipt_long',
  },
  {
    id: 'tl_02',
    claimId: 'clm_01',
    type: 'evidence_uploaded',
    title: 'Display Defect Observed',
    description:
      'Persistent display flickering and unresponsive touch zones appeared along the left edge of the screen. Photos of the defect were captured and uploaded to the evidence locker.',
    date: '2024-10-25T10:15:00Z',
    attachmentFileName: 'iphone15_display_defect.jpg',
    attachmentUri: 'file:///evidence/iphone15_display_defect.jpg',
    attachmentIcon: 'photo_library',
  },
  {
    id: 'tl_03',
    claimId: 'clm_01',
    type: 'support_contact',
    title: 'Contacted Apple Support',
    description:
      'Initiated a live chat with Apple Support. Agent Priya M. acknowledged the display issue and offered a Genius Bar appointment, then reversed position after consulting a supervisor, citing "accidental damage."',
    date: '2024-10-28T15:00:00Z',
    attachmentFileName: 'apple_support_chat_oct28.html',
    attachmentUri: 'file:///evidence/apple_support_chat_oct28.html',
    attachmentIcon: 'forum',
  },
  {
    id: 'tl_04',
    claimId: 'clm_01',
    type: 'denial_received',
    title: 'Initial Claim Denied',
    description:
      'Received formal denial email from Apple Customer Relations. The denial states the device "shows signs of accidental damage not covered under the Apple Limited Warranty." No diagnostic report was provided.',
    date: '2024-10-29T11:30:00Z',
    attachmentFileName: 'apple_denial_oct29.eml',
    attachmentUri: 'file:///evidence/apple_denial_oct29.eml',
    attachmentIcon: 'mail',
  },
  {
    id: 'tl_05',
    claimId: 'clm_01',
    type: 'follow_up',
    title: 'Follow-Up Appeal Drafted',
    description:
      'Claimwell generated a formal appeal letter (v2.4, assertive tone) addressing the denial. The draft references warranty terms, photographic evidence, the support chat contradiction, and includes an escalation warning. Ready for review and sending.',
    date: '2024-10-30T14:15:00Z',
    attachmentFileName: null,
    attachmentUri: null,
    attachmentIcon: null,
  },
];
