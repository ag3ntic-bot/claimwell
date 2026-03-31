jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import {
  AISummarySchema,
  AIExtractionSchema,
  AIClaimScoreSchema,
  AIResponseAnalysisSchema,
  validateAIOutput,
  AIValidationError,
} from '../validation';

describe('AI validation schemas', () => {
  // ---------- AISummarySchema ----------
  describe('AISummarySchema', () => {
    it('passes for valid data', () => {
      const valid = { summary: 'A brief summary.', keyPoints: ['Point 1', 'Point 2'] };
      expect(AISummarySchema.parse(valid)).toEqual(valid);
    });

    it('fails when summary is missing', () => {
      const invalid = { keyPoints: ['Point 1'] };
      const result = AISummarySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('fails when summary is empty', () => {
      const invalid = { summary: '', keyPoints: [] };
      const result = AISummarySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('passes with empty keyPoints array', () => {
      const valid = { summary: 'Summary text.', keyPoints: [] };
      // keyPoints is z.array(z.string().min(1)) -- empty array is valid
      const result = AISummarySchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('fails when keyPoints contains non-string values', () => {
      const invalid = { summary: 'Summary', keyPoints: [123, true] };
      const result = AISummarySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  // ---------- AIExtractionSchema ----------
  describe('AIExtractionSchema', () => {
    it('passes for valid extraction data', () => {
      const valid = {
        fields: { name: 'John', amount: 100 },
        confidence: 0.85,
      };
      expect(AIExtractionSchema.parse(valid)).toEqual(valid);
    });

    it('fails when confidence is below 0', () => {
      const invalid = { fields: {}, confidence: -0.1 };
      const result = AIExtractionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('fails when confidence is above 1', () => {
      const invalid = { fields: {}, confidence: 1.5 };
      const result = AIExtractionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('passes with confidence at boundary values 0 and 1', () => {
      expect(AIExtractionSchema.safeParse({ fields: {}, confidence: 0 }).success).toBe(true);
      expect(AIExtractionSchema.safeParse({ fields: {}, confidence: 1 }).success).toBe(true);
    });
  });

  // ---------- AIClaimScoreSchema ----------
  describe('AIClaimScoreSchema', () => {
    it('passes for valid score data', () => {
      const valid = {
        score: 75,
        reasoning: 'Strong documentation supports the claim.',
        factors: [
          { label: 'Documentation', impact: 'positive' as const, weight: 0.8 },
        ],
      };
      expect(AIClaimScoreSchema.parse(valid)).toEqual(valid);
    });

    it('fails when score is below 0', () => {
      const invalid = {
        score: -5,
        reasoning: 'Bad score',
        factors: [],
      };
      const result = AIClaimScoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('fails when score is above 100', () => {
      const invalid = {
        score: 105,
        reasoning: 'Too high',
        factors: [],
      };
      const result = AIClaimScoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('fails when reasoning is missing', () => {
      const invalid = {
        score: 50,
        factors: [],
      };
      const result = AIClaimScoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('fails when reasoning is empty string', () => {
      const invalid = {
        score: 50,
        reasoning: '',
        factors: [],
      };
      const result = AIClaimScoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  // ---------- AIResponseAnalysisSchema ----------
  describe('AIResponseAnalysisSchema', () => {
    const validAnalysis = {
      sentiment: 'Dismissive',
      sentimentScore: -0.6,
      resolutionProbability: 0.3,
      tactics: ['Deflection', 'Delay'],
      recommendation: 'Escalate to supervisor.',
      strategyDraft: 'Draft a formal complaint...',
    };

    it('passes for valid response analysis data', () => {
      expect(AIResponseAnalysisSchema.parse(validAnalysis)).toEqual(validAnalysis);
    });

    it('fails when sentiment is missing', () => {
      const { sentiment, ...rest } = validAnalysis;
      const result = AIResponseAnalysisSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('fails when recommendation is missing', () => {
      const { recommendation, ...rest } = validAnalysis;
      const result = AIResponseAnalysisSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('fails when strategyDraft is missing', () => {
      const { strategyDraft, ...rest } = validAnalysis;
      const result = AIResponseAnalysisSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('fails when sentimentScore is out of range', () => {
      const result = AIResponseAnalysisSchema.safeParse({
        ...validAnalysis,
        sentimentScore: -2,
      });
      expect(result.success).toBe(false);
    });

    it('fails when resolutionProbability exceeds 1', () => {
      const result = AIResponseAnalysisSchema.safeParse({
        ...validAnalysis,
        resolutionProbability: 1.5,
      });
      expect(result.success).toBe(false);
    });

    it('passes with empty tactics array', () => {
      const result = AIResponseAnalysisSchema.safeParse({
        ...validAnalysis,
        tactics: [],
      });
      expect(result.success).toBe(true);
    });
  });

  // ---------- validateAIOutput ----------
  describe('validateAIOutput', () => {
    it('parses valid structured output correctly', () => {
      const raw = {
        structured: {
          summary: 'Parsed from structured field.',
          keyPoints: ['A', 'B'],
        },
        content: '',
      };

      const result = validateAIOutput(AISummarySchema, raw, 'summarize');
      expect(result.summary).toBe('Parsed from structured field.');
      expect(result.keyPoints).toEqual(['A', 'B']);
    });

    it('falls back to JSON.parse of content when structured is undefined', () => {
      const raw = {
        structured: undefined,
        content: JSON.stringify({
          summary: 'From content.',
          keyPoints: ['X'],
        }),
      };

      const result = validateAIOutput(AISummarySchema, raw, 'summarize');
      expect(result.summary).toBe('From content.');
    });

    it('throws AIValidationError for invalid JSON content', () => {
      const raw = {
        content: 'not valid json {{{',
      };

      expect(() => validateAIOutput(AISummarySchema, raw, 'summarize')).toThrow(
        AIValidationError,
      );
    });

    it('throws AIValidationError with field details for malformed structure', () => {
      const raw = {
        structured: { summary: '', keyPoints: 'not-an-array' },
        content: '',
      };

      try {
        validateAIOutput(AISummarySchema, raw, 'summarize');
        fail('Expected AIValidationError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AIValidationError);
        const validationError = error as AIValidationError;
        expect(validationError.issues.length).toBeGreaterThan(0);
        expect(validationError.message).toContain('summarize');
      }
    });

    it('AIValidationError includes issue paths', () => {
      const raw = {
        structured: { score: 200, reasoning: '', factors: [] },
        content: '',
      };

      try {
        validateAIOutput(AIClaimScoreSchema, raw, 'score-claim');
        fail('Expected AIValidationError');
      } catch (error) {
        const err = error as AIValidationError;
        expect(err.name).toBe('AIValidationError');
        // Should report issues for both score (>100) and reasoning (empty)
        expect(err.issues.length).toBeGreaterThanOrEqual(2);
      }
    });
  });
});
