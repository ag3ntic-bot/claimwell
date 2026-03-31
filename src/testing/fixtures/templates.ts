import type { Template } from '@/types';

export const mockTemplates: Template[] = [
  {
    id: 'tpl_01',
    title: 'Defective Product Refund Request',
    category: 'refunds',
    description:
      'A firm but professional letter requesting a full refund for a defective product. Cites consumer protection rights and provides a clear deadline for response.',
    tags: ['defective', 'refund', 'consumer rights', 'deadline'],
    content: `Dear [Company Name] Customer Service,

I am writing to request a full refund of [Amount] for [Product Name], purchased on [Purchase Date] (Order #[Order Number]).

The product is defective: [Description of Defect]. This defect was present upon receipt / developed within [Timeframe] of normal use and renders the product unfit for its intended purpose.

Under [applicable consumer protection law / the implied warranty of merchantability], I am entitled to a full refund for a product that fails to meet reasonable quality standards.

I have attached the following supporting documentation:
- Original purchase receipt
- Photos/videos of the defect
- Any prior correspondence regarding this issue

I respectfully request that a full refund of [Amount] be issued to my original payment method within 14 business days of this letter. If I do not receive a satisfactory response, I will pursue all available remedies, including filing a complaint with [relevant consumer protection agency].

Sincerely,
[Your Name]
[Your Contact Information]`,
    usageCount: 1842,
  },
  {
    id: 'tpl_02',
    title: 'Warranty Claim — Manufacturing Defect',
    category: 'warranty',
    description:
      'A structured warranty claim letter for products that developed defects during the warranty period. Includes sections for evidence, warranty terms, and requested resolution.',
    tags: ['warranty', 'manufacturing defect', 'repair', 'replacement'],
    content: `Dear [Manufacturer Name] Warranty Department,

I am submitting a formal warranty claim for my [Product Name] (Serial Number: [Serial Number]), purchased on [Purchase Date] from [Retailer Name].

## Defect Description
[Detailed description of the defect, when it was first observed, and how it affects the product's functionality.]

## Warranty Coverage
This product is within the [Duration] manufacturer warranty period, which covers defects in materials and workmanship under normal use. The defect described above is a manufacturing issue — not the result of misuse, accidental damage, or unauthorized modification.

## Supporting Evidence
- Purchase receipt (attached)
- Photos/video of the defect (attached)
- [Any diagnostic reports or prior service records]

## Requested Resolution
I am requesting [a full replacement / repair at no cost / a complete refund] in accordance with the warranty terms.

Please respond within 10 business days with a resolution or the next steps for processing this claim. I can be reached at [Your Contact Information].

Sincerely,
[Your Name]`,
    usageCount: 1356,
  },
  {
    id: 'tpl_03',
    title: 'Subscription Cancellation & Refund Demand',
    category: 'subscription',
    description:
      'A direct letter for situations where a subscription was not properly cancelled or charges continued after cancellation. Demands a refund for unauthorized charges.',
    tags: ['subscription', 'cancellation', 'unauthorized charge', 'billing dispute'],
    content: `Dear [Company Name] Billing Department,

I am writing to dispute unauthorized charges on my account and demand an immediate refund.

## Account Details
- Account holder: [Your Name]
- Account/Subscription ID: [ID]
- Email on file: [Your Email]

## Issue
I [cancelled my subscription / requested cancellation] on [Cancellation Date] via [method — e.g., online portal, phone call, email]. Despite this, I have been charged [Amount] on [Charge Date(s)].

[If applicable: I have confirmation of my cancellation — reference number [Reference Number] / screenshot attached.]

## Demand
Under [applicable consumer protection law], you are required to honor cancellation requests and refund unauthorized charges. I demand:

1. Immediate cancellation of my subscription, if not already processed.
2. A full refund of [Amount] for all charges incurred after my cancellation date.
3. Written confirmation that no further charges will be made to my payment method.

If this matter is not resolved within 10 business days, I will dispute the charges with my bank and file complaints with the FTC and [state consumer protection agency].

Sincerely,
[Your Name]
[Your Contact Information]`,
    usageCount: 987,
  },
  {
    id: 'tpl_04',
    title: 'Missing or Lost Package Claim',
    category: 'delivery',
    description:
      'A claim letter for packages marked as delivered but never received. Includes sections for delivery details, building/neighbor verification, and resolution request.',
    tags: ['missing package', 'delivery', 'lost', 'not received'],
    content: `Dear [Company Name / Carrier Name] Customer Service,

I am writing to report that a package was marked as delivered but was never received.

## Order Details
- Order Number: [Order Number]
- Tracking Number: [Tracking Number]
- Delivery address: [Your Address]
- Marked delivered: [Date and Time]

## Verification Steps Taken
I have taken the following steps to locate the package:
- Checked all delivery areas around my residence (front door, side door, mailroom, etc.)
- [Checked with building concierge / front desk — no record of delivery]
- [Asked neighbors — none received the package]
- [Reviewed security camera footage — no delivery captured during the stated timeframe]
- [No delivery photo was provided as proof of delivery]

## Requested Resolution
I am requesting [a full refund of Amount / a replacement shipment] for this order. The package was not delivered to me or any authorized recipient at my address.

Please process this request within 7 business days. I am happy to provide any additional information needed.

Sincerely,
[Your Name]
[Your Contact Information]`,
    usageCount: 1124,
  },
  {
    id: 'tpl_05',
    title: 'Formal Appeal of Denied Claim',
    category: 'appeals',
    description:
      'A formal escalation letter for claims that were initially denied. Structured to systematically address and rebut the stated reasons for denial.',
    tags: ['appeal', 'denial', 'escalation', 'formal', 'rebuttal'],
    content: `Dear [Company Name] [Department — e.g., Customer Relations, Claims Department],

I am writing to formally appeal the denial of my claim, reference number [Case/Claim Number], dated [Denial Date].

## Background
[Brief summary of the original claim — what happened, when, and what you requested.]

## Denial Reason & Rebuttal
Your denial letter states: "[Quote the denial reason]."

I respectfully dispute this determination for the following reasons:

1. [First reason the denial is incorrect, with supporting evidence.]
2. [Second reason, citing specific policy terms, warranty language, or consumer protection law.]
3. [Third reason, referencing any contradictions in the company's handling of the claim.]

## Supporting Evidence
The following documents are attached to support this appeal:
- [List each piece of evidence with a brief description]

## Requested Resolution
I am requesting [specific resolution — refund, replacement, repair, credit] within [timeframe] of this letter.

## Next Steps
If this appeal is not resolved satisfactorily, I am prepared to:
- Escalate to [executive leadership / ombudsman]
- File a complaint with [relevant regulatory body — FTC, state AG, BBB]
- [If applicable: Pursue arbitration / small claims court as permitted under the terms of service]

I trust that a fair review of the evidence will lead to a just resolution.

Sincerely,
[Your Name]
[Your Contact Information]`,
    usageCount: 2103,
  },
];
