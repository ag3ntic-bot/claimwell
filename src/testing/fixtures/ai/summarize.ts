import type { AIOutput, AISummary } from '@/types';

export const mockSummarizeOutput: AIOutput = {
  content: JSON.stringify({
    summary:
      'Alexander Vance purchased an iPhone 15 Pro Max from Apple on September 22, 2023 for $1,199. Within one month, the device developed display flickering and unresponsive touch zones — symptoms consistent with a known display controller defect. Apple denied the warranty claim on October 29, citing accidental damage, despite no physical damage being present and their own support agent initially acknowledging the defect.',
    keyPoints: [
      'Device is within the one-year Apple Limited Warranty period.',
      'Display defect is consistent with a known manufacturing issue in early iPhone 15 Pro Max units.',
      'Apple denied the claim citing accidental damage — no diagnostic report was provided to support this.',
      'Support agent contradicted themselves during the October 28 chat session.',
      'Appeal window is open for 12 more days (deadline: November 11, 2024).',
    ],
  } satisfies AISummary),
  structured: {
    summary:
      'Alexander Vance purchased an iPhone 15 Pro Max from Apple on September 22, 2023 for $1,199. Within one month, the device developed display flickering and unresponsive touch zones — symptoms consistent with a known display controller defect. Apple denied the warranty claim on October 29, citing accidental damage, despite no physical damage being present and their own support agent initially acknowledging the defect.',
    keyPoints: [
      'Device is within the one-year Apple Limited Warranty period.',
      'Display defect is consistent with a known manufacturing issue in early iPhone 15 Pro Max units.',
      'Apple denied the claim citing accidental damage — no diagnostic report was provided to support this.',
      'Support agent contradicted themselves during the October 28 chat session.',
      'Appeal window is open for 12 more days (deadline: November 11, 2024).',
    ],
  },
  tokensUsed: 312,
  model: 'claude-3-5-haiku-20241022',
  latencyMs: 1840,
  cached: false,
};
