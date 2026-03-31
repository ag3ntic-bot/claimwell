import type { Strategy } from '@/types';

export const mockStrategy: Strategy = {
  claimId: 'clm_01',
  recommendedAction: 'Send Formal Appeal Letter',
  actionDescription:
    'Draft and send a formal written appeal to Apple Customer Relations referencing case #APL-99283. The letter should cite the Apple Limited Warranty terms, attach photographic evidence showing no physical impact, and reference the contradiction in the support chat where the agent initially acknowledged the defect before reversing their position.',
  claimStrength: 84,
  winProbability: 0.76,
  attentionItems: [
    {
      icon: 'schedule',
      description: 'Appeal window closes in 12 days — act before November 11, 2024.',
      priority: 'high',
    },
    {
      icon: 'error_outline',
      description:
        'Support chat agent contradicted themselves — strong leverage point for the appeal.',
      priority: 'high',
    },
    {
      icon: 'info',
      description:
        'No written diagnostic report was provided with the denial. Request one to strengthen your position.',
      priority: 'medium',
    },
    {
      icon: 'lightbulb',
      description:
        'Similar display defects in early iPhone 15 Pro Max units have been reported online. Consider referencing community reports as supporting evidence.',
      priority: 'low',
    },
  ],
  escalationLadder: [
    {
      order: 1,
      title: 'Initial Support Contact',
      description:
        'Contacted Apple Support via chat on October 28. Agent acknowledged defect then reversed position after supervisor consultation.',
      status: 'completed',
      date: '2024-10-28T15:00:00Z',
    },
    {
      order: 2,
      title: 'Formal Written Appeal',
      description:
        'Send a detailed appeal letter to Apple Customer Relations with all supporting evidence attached. Reference warranty terms, photographic proof, and the agent contradiction.',
      status: 'active',
      date: null,
    },
    {
      order: 3,
      title: 'Executive Escalation',
      description:
        'If the written appeal is denied, escalate to Apple Executive Relations via email to tcook@apple.com. Include all prior correspondence and a summary of the dispute timeline.',
      status: 'pending',
      date: null,
    },
    {
      order: 4,
      title: 'Regulatory Complaint',
      description:
        'File a complaint with the FTC and your state attorney general consumer protection division. Reference the Magnuson-Moss Warranty Act if Apple continues to deny a valid warranty claim.',
      status: 'pending',
      date: null,
    },
  ],
  daysLeftToAppeal: 12,
  aiSummary:
    'Your claim has strong merit. The iPhone 15 Pro Max is within its one-year warranty period, and the display defect is consistent with a known manufacturing issue — not accidental damage. Apple\'s denial lacks a diagnostic report, and the support agent\'s contradiction (initially acknowledging the defect, then reversing) is a significant leverage point. A well-crafted formal appeal has approximately a 76% chance of success based on similar resolved cases.',
  generatedAt: '2024-10-30T14:00:00Z',
};
