import type { AIOutput, AIDraft } from '@/types';

export const mockDraftOutput: AIOutput = {
  content: JSON.stringify({
    content: `Dear Apple Customer Relations,

I am writing to formally appeal the denial of my warranty claim, case reference #APL-99283, regarding a defective iPhone 15 Pro Max (Serial: F2LXK4NDJQ7P) purchased on September 22, 2023 from the Apple Fifth Avenue store.

## Summary of the Issue

Within approximately one month of purchase, my iPhone 15 Pro Max developed persistent display flickering and unresponsive touch zones along the left edge of the screen. This is a hardware defect — not the result of any accidental damage, drop, or misuse.

## Why the Denial Is Incorrect

Your denial letter dated October 29, 2024 states the device "shows signs of accidental damage not covered under the Apple Limited Warranty." I respectfully but firmly dispute this conclusion for the following reasons:

1. **No physical damage exists.** The attached photographs clearly show the device exterior is in pristine condition — no cracks, dents, scratches, or evidence of impact.

2. **Your own support agent acknowledged the defect.** During my October 28 support chat, agent Priya M. initially recognized the display issue and offered a Genius Bar appointment. This was reversed without technical justification.

3. **No diagnostic report was shared.** Apple has not provided any diagnostic data to substantiate the claim of accidental damage. Under the Magnuson-Moss Warranty Act, the burden is on the warrantor.

4. **Known manufacturing issue.** Multiple reports from other iPhone 15 Pro Max owners describe identical display symptoms.

## Requested Resolution

I request a full replacement or complete refund of $1,199.00 within 14 business days.

Sincerely,
Alexander Vance`,
    reasoning:
      'Assertive tone selected to convey seriousness and preparedness. The letter systematically dismantles the denial by addressing each claim with evidence. Key legal reference (Magnuson-Moss Warranty Act) establishes the consumer\'s legal standing without being threatening. The 14-day deadline creates urgency while remaining reasonable.',
    tone: 'assertive',
    version: '2.4',
  } satisfies AIDraft),
  structured: {
    content: 'Dear Apple Customer Relations...',
    reasoning:
      'Assertive tone selected to convey seriousness and preparedness. The letter systematically dismantles the denial by addressing each claim with evidence.',
    tone: 'assertive',
    version: '2.4',
  },
  tokensUsed: 1456,
  model: 'claude-sonnet-4-20250514',
  latencyMs: 6210,
  cached: false,
};
