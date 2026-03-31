import { NewClaimFormSchema, ResponseAnalyzerFormSchema } from '../validation';

describe('NewClaimFormSchema', () => {
  const validData = {
    category: 'warranty' as const,
    companyName: 'Apple Inc.',
    description: 'My device has a persistent display flickering issue.',
    amountClaimed: 1199,
  };

  it('passes with valid data', () => {
    const result = NewClaimFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('passes with optional fields included', () => {
    const result = NewClaimFormSchema.safeParse({
      ...validData,
      policyNumber: 'POL-123',
      serialNumber: 'SN-456',
    });
    expect(result.success).toBe(true);
  });

  it('fails when category is missing', () => {
    const { category, ...rest } = validData;
    const result = NewClaimFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('fails when category is invalid', () => {
    const result = NewClaimFormSchema.safeParse({
      ...validData,
      category: 'invalid_category',
    });
    expect(result.success).toBe(false);
  });

  it('fails when companyName is empty', () => {
    const result = NewClaimFormSchema.safeParse({
      ...validData,
      companyName: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails when companyName is too short', () => {
    const result = NewClaimFormSchema.safeParse({
      ...validData,
      companyName: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('fails when description is too short', () => {
    const result = NewClaimFormSchema.safeParse({
      ...validData,
      description: 'Short',
    });
    expect(result.success).toBe(false);
  });

  it('fails when description is missing', () => {
    const { description, ...rest } = validData;
    const result = NewClaimFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('fails when amountClaimed is negative', () => {
    const result = NewClaimFormSchema.safeParse({
      ...validData,
      amountClaimed: -100,
    });
    expect(result.success).toBe(false);
  });

  it('fails when amountClaimed is zero', () => {
    const result = NewClaimFormSchema.safeParse({
      ...validData,
      amountClaimed: 0,
    });
    expect(result.success).toBe(false);
  });

  it('fails when amountClaimed is not a number', () => {
    const result = NewClaimFormSchema.safeParse({
      ...validData,
      amountClaimed: 'not_a_number',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid category values', () => {
    const categories = ['refund', 'warranty', 'subscription', 'delivery', 'other'] as const;
    for (const category of categories) {
      const result = NewClaimFormSchema.safeParse({ ...validData, category });
      expect(result.success).toBe(true);
    }
  });
});

describe('ResponseAnalyzerFormSchema', () => {
  it('passes with valid response text', () => {
    const result = ResponseAnalyzerFormSchema.safeParse({
      responseText: 'We have reviewed your claim and determined that the damage is not covered.',
    });
    expect(result.success).toBe(true);
  });

  it('fails when responseText is empty', () => {
    const result = ResponseAnalyzerFormSchema.safeParse({
      responseText: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails when responseText is too short', () => {
    const result = ResponseAnalyzerFormSchema.safeParse({
      responseText: 'Short',
    });
    expect(result.success).toBe(false);
  });

  it('fails when responseText is missing', () => {
    const result = ResponseAnalyzerFormSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('passes with exactly 10 characters', () => {
    const result = ResponseAnalyzerFormSchema.safeParse({
      responseText: '1234567890',
    });
    expect(result.success).toBe(true);
  });
});
