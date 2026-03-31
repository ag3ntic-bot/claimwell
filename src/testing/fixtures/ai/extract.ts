import type { AIOutput, AIExtraction } from '@/types';

export const mockExtractOutput: AIOutput = {
  content: JSON.stringify({
    fields: {
      productName: 'iPhone 15 Pro Max 256GB',
      purchaseDate: '2023-09-22',
      purchasePrice: 1199,
      storeName: 'Apple Fifth Avenue',
      paymentMethod: 'Apple Card',
      serialNumber: 'F2LXK4NDJQ7P',
      warrantyExpiration: '2024-09-22',
      claimantName: 'Alexander Vance',
      currency: 'USD',
    },
    confidence: 0.97,
  } satisfies AIExtraction),
  structured: {
    fields: {
      productName: 'iPhone 15 Pro Max 256GB',
      purchaseDate: '2023-09-22',
      purchasePrice: 1199,
      storeName: 'Apple Fifth Avenue',
      paymentMethod: 'Apple Card',
      serialNumber: 'F2LXK4NDJQ7P',
      warrantyExpiration: '2024-09-22',
      claimantName: 'Alexander Vance',
      currency: 'USD',
    },
    confidence: 0.97,
  },
  tokensUsed: 245,
  model: 'claude-3-5-haiku-20241022',
  latencyMs: 1120,
  cached: false,
};
