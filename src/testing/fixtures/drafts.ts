import type { Draft } from '@/types';

export const mockDraft: Draft = {
  id: 'drf_01',
  claimId: 'clm_01',
  tone: 'assertive',
  version: '2.4',
  subject: 'Formal Appeal — Warranty Claim #APL-99283 (iPhone 15 Pro Max Display Defect)',
  recipientName: 'Apple Customer Relations',
  recipientTitle: 'Customer Relations Department',
  content: `Dear Apple Customer Relations,

I am writing to formally appeal the denial of my warranty claim, case reference #APL-99283, regarding a defective iPhone 15 Pro Max (Serial: F2LXK4NDJQ7P) purchased on September 22, 2023 from the Apple Fifth Avenue store.

## Summary of the Issue

Within approximately one month of purchase, my iPhone 15 Pro Max developed persistent display flickering and unresponsive touch zones along the left edge of the screen. This is a hardware defect — not the result of any accidental damage, drop, or misuse.

## Why the Denial Is Incorrect

Your denial letter dated October 29, 2024 states the device "shows signs of accidental damage not covered under the Apple Limited Warranty." I respectfully but firmly dispute this conclusion for the following reasons:

1. **No physical damage exists.** The attached photographs clearly show the device exterior is in pristine condition — no cracks, dents, scratches, or evidence of impact. The display artifacts are internal and consistent with a controller defect, not external force.

2. **Your own support agent acknowledged the defect.** During my October 28 support chat, agent Priya M. initially recognized the display issue and offered a Genius Bar appointment. This assessment was reversed only after a supervisor intervened, with no technical justification provided.

3. **No diagnostic report was shared.** Apple has not provided any diagnostic data or repair assessment to substantiate the claim of accidental damage. Under the Magnuson-Moss Warranty Act, the burden is on the warrantor to demonstrate that damage falls outside warranty coverage.

4. **Known manufacturing issue.** Multiple reports from other iPhone 15 Pro Max owners describe identical display symptoms, suggesting a broader manufacturing defect in early production units.

## What I Am Requesting

I am requesting one of the following resolutions within 14 business days:

- A full replacement of the defective iPhone 15 Pro Max under the Apple Limited Warranty, **or**
- A complete refund of $1,199.00 to the original payment method.

## Attached Evidence

- Photographs of the display defect (no physical damage visible)
- Original purchase receipt ($1,199.00, Apple Fifth Avenue, Sep 22, 2023)
- Chat transcript with Apple Support (Oct 28, 2024)
- Your denial email (Oct 29, 2024)
- Apple Limited Warranty terms

I trust Apple will do the right thing. If this matter is not resolved satisfactorily, I will escalate to Apple Executive Relations and, if necessary, file a formal complaint with the Federal Trade Commission and my state attorney general.

Sincerely,
Alexander Vance
alexander.vance@curatedclaims.com`,
  aiReasoning:
    'This draft uses an assertive tone to establish credibility and urgency while remaining professional. The letter leads with a clear summary, then systematically dismantles each element of the denial. Key strategic choices: (1) citing the Magnuson-Moss Warranty Act shifts the burden of proof to Apple, (2) referencing the support agent contradiction demonstrates inconsistency in Apple\'s own assessment, (3) mentioning known manufacturing issues broadens the claim beyond a single device, and (4) the escalation warning (FTC, attorney general) signals the consumer is informed and prepared to pursue all available remedies. The 14-business-day deadline creates urgency without being unreasonable.',
  generatedAt: '2024-10-30T14:15:00Z',
};
