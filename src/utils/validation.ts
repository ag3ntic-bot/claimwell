import { z } from 'zod';

/**
 * Schema for the New Claim form.
 */
export const NewClaimFormSchema = z.object({
  category: z.enum(['refund', 'warranty', 'subscription', 'delivery', 'other'], {
    error: 'Please select a claim category.',
  }),
  companyName: z
    .string({ error: 'Company name is required.' })
    .min(2, 'Company name must be at least 2 characters.'),
  description: z
    .string({ error: 'Description is required.' })
    .min(10, 'Description must be at least 10 characters.'),
  amountClaimed: z
    .number({ error: 'Amount must be a valid number.' })
    .positive('Amount must be greater than zero.'),
  policyNumber: z.string().optional(),
  serialNumber: z.string().optional(),
});

export type NewClaimFormData = z.infer<typeof NewClaimFormSchema>;

/**
 * Schema for the Response Analyzer form.
 */
export const ResponseAnalyzerFormSchema = z.object({
  responseText: z
    .string({ error: 'Response text is required.' })
    .min(10, 'Response text must be at least 10 characters.'),
});

export type ResponseAnalyzerFormData = z.infer<typeof ResponseAnalyzerFormSchema>;
