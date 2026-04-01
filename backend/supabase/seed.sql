-- ============================================================================
-- Claimwell: Seed Data (Templates)
-- ============================================================================

INSERT INTO templates (id, title, category, description, tags, content, usage_count) VALUES
(
  'a0000000-0000-4000-8000-000000000001',
  'Product Refund Request',
  'refunds',
  'Standard template for requesting a refund on a defective or unsatisfactory product. Covers consumer protection rights and warranty claims.',
  ARRAY['refund', 'product', 'defective', 'warranty'],
  E'Dear [Company Name] Customer Support,\n\nI am writing to request a full refund for [Product Name] purchased on [Purchase Date] for [Amount].\n\n**Issue Description:**\n[Describe the issue with the product]\n\n**Supporting Evidence:**\n- Purchase receipt (attached)\n- Photos of the defect (attached)\n\nUnder [applicable consumer protection law], I am entitled to a refund for products that are not fit for purpose. I have attempted to resolve this through [previous steps taken], but the issue remains unresolved.\n\nI request a full refund of [Amount] to my original payment method within 14 business days.\n\nPlease confirm receipt of this request and provide a timeline for resolution.\n\nSincerely,\n[Your Name]',
  342
),
(
  'a0000000-0000-4000-8000-000000000002',
  'Warranty Claim Letter',
  'warranty',
  'Formal warranty claim template for products within warranty period. Includes references to warranty terms and manufacturer obligations.',
  ARRAY['warranty', 'manufacturer', 'repair', 'replacement'],
  E'Dear [Manufacturer/Retailer],\n\nI am writing to submit a warranty claim for my [Product Name], serial number [Serial Number], purchased on [Purchase Date].\n\n**Product Information:**\n- Product: [Product Name]\n- Serial Number: [Serial Number]\n- Purchase Date: [Purchase Date]\n- Warranty Expiration: [Warranty End Date]\n\n**Issue Description:**\n[Describe the defect or malfunction in detail]\n\nThis issue falls within the scope of the manufacturer''s warranty, which covers [relevant warranty terms]. I have not modified the product or used it outside of its intended purpose.\n\n**Requested Resolution:**\nI request [repair/replacement/refund] as provided under the warranty terms.\n\nI have attached the following documentation:\n1. Proof of purchase\n2. Photos/videos of the defect\n3. Copy of warranty documentation\n\nPlease respond within 10 business days with next steps.\n\nThank you,\n[Your Name]',
  278
),
(
  'a0000000-0000-4000-8000-000000000003',
  'Subscription Cancellation & Refund',
  'subscription',
  'Template for disputing unauthorized subscription charges, requesting cancellation, and demanding refund for services not rendered.',
  ARRAY['subscription', 'cancellation', 'unauthorized', 'recurring charge'],
  E'Dear [Company Name] Billing Department,\n\nI am writing regarding unauthorized/unwanted charges on my account [Account Number/Email].\n\n**Charge Details:**\n- Amount: [Amount]\n- Date(s): [Charge Dates]\n- Description: [Charge Description]\n\n**Issue:**\n[Explain why the charges are disputed - e.g., service was cancelled, never authorized, terms changed without notice]\n\n**Actions Requested:**\n1. Immediate cancellation of my subscription\n2. Full refund of [Amount] for charges dating back to [Date]\n3. Written confirmation that no future charges will be made\n\nI have previously attempted to resolve this by [previous steps]. If this matter is not resolved within 14 days, I will file a complaint with [relevant consumer agency] and dispute the charges with my financial institution.\n\nPlease confirm receipt and provide a case number.\n\nRegards,\n[Your Name]',
  456
),
(
  'a0000000-0000-4000-8000-000000000004',
  'Missing/Damaged Delivery Claim',
  'delivery',
  'Template for filing claims about packages that were never delivered, arrived damaged, or contained wrong items.',
  ARRAY['delivery', 'shipping', 'damaged', 'missing package', 'wrong item'],
  E'Dear [Company Name/Carrier] Customer Service,\n\nI am writing to report an issue with my recent order.\n\n**Order Information:**\n- Order Number: [Order Number]\n- Order Date: [Order Date]\n- Expected Delivery: [Expected Date]\n- Tracking Number: [Tracking Number]\n\n**Issue:**\n[Select one: Package never delivered / Package arrived damaged / Wrong item received]\n\n[Detailed description of the issue]\n\n**Evidence:**\n- Photos of [damaged package/wrong item] (attached)\n- Screenshot of tracking information (attached)\n- Communication with delivery driver/carrier (if applicable)\n\n**Requested Resolution:**\nI request [full refund / replacement shipment / store credit] for this order.\n\nPlease investigate this matter and respond within 5 business days.\n\nThank you,\n[Your Name]',
  189
),
(
  'a0000000-0000-4000-8000-000000000005',
  'Formal Appeal Letter',
  'appeals',
  'Comprehensive appeal template for when an initial claim has been denied. Structured to address denial reasons and present additional evidence.',
  ARRAY['appeal', 'denial', 'escalation', 'formal', 'reconsideration'],
  E'Dear [Company Name] Appeals Department,\n\nRe: Appeal of Claim Denial - Case Number [Case Number]\n\nI am writing to formally appeal the denial of my claim dated [Denial Date]. After careful review of the denial letter and the applicable policies, I believe the denial was made in error.\n\n**Original Claim Summary:**\n- Claim Date: [Original Claim Date]\n- Claim Amount: [Amount]\n- Category: [Category]\n- Denial Reason: [Stated reason for denial]\n\n**Grounds for Appeal:**\n\n1. **[First Ground]:** [Explain why the denial reason is incorrect or insufficient, citing specific policy language, consumer protection laws, or precedent]\n\n2. **[Second Ground]:** [Present additional evidence or context not considered in the original review]\n\n3. **[Third Ground]:** [Reference any applicable regulations, warranty terms, or contractual obligations]\n\n**Additional Evidence:**\n[List new supporting documents being submitted with this appeal]\n\n**Requested Action:**\nI respectfully request that you overturn the denial and [approve the claim / issue a refund of Amount / provide replacement]. If this appeal is denied, please provide a detailed written explanation of the reasons and information about further escalation options.\n\nI expect a response within [timeframe per applicable regulations]. If I do not receive a satisfactory response, I will escalate this matter to [regulatory body/BBB/attorney general].\n\nSincerely,\n[Your Name]\n\nEnclosures:\n- Original claim documentation\n- Denial letter dated [Date]\n- [Additional evidence items]',
  523
);
