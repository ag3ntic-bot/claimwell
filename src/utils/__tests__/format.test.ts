import { formatCurrency, formatRelativeDate, formatAbsoluteDate, formatPercentage } from '../format';

describe('formatCurrency', () => {
  it('formats a positive integer amount', () => {
    expect(formatCurrency(1199)).toBe('$1,199');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formats a large number with commas', () => {
    expect(formatCurrency(1250000)).toBe('$1,250,000');
  });

  it('formats a negative number', () => {
    expect(formatCurrency(-54.99)).toBe('-$54.99');
  });

  it('formats a decimal amount', () => {
    expect(formatCurrency(54.99)).toBe('$54.99');
  });

  it('formats a small decimal without trailing zeros', () => {
    expect(formatCurrency(10)).toBe('$10');
  });
});

describe('formatRelativeDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-11-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns "just now" for dates less than a minute ago', () => {
    const date = new Date('2024-11-01T11:59:30Z');
    expect(formatRelativeDate(date)).toBe('just now');
  });

  it('returns minutes ago for dates less than an hour ago', () => {
    const date = new Date('2024-11-01T11:45:00Z');
    expect(formatRelativeDate(date)).toBe('15 minutes ago');
  });

  it('returns "1 minute ago" for a single minute', () => {
    const date = new Date('2024-11-01T11:58:55Z');
    expect(formatRelativeDate(date)).toBe('1 minute ago');
  });

  it('returns hours ago for dates less than a day ago', () => {
    const date = new Date('2024-11-01T06:00:00Z');
    expect(formatRelativeDate(date)).toBe('6 hours ago');
  });

  it('returns "1 day ago" for yesterday', () => {
    const date = new Date('2024-10-31T12:00:00Z');
    expect(formatRelativeDate(date)).toBe('1 day ago');
  });

  it('returns "3 days ago" for three days back', () => {
    const date = new Date('2024-10-29T12:00:00Z');
    expect(formatRelativeDate(date)).toBe('3 days ago');
  });

  it('returns "2 weeks ago" for two weeks back', () => {
    const date = new Date('2024-10-18T12:00:00Z');
    expect(formatRelativeDate(date)).toBe('2 weeks ago');
  });

  it('returns "3 months ago" for three months back', () => {
    const date = new Date('2024-08-01T12:00:00Z');
    expect(formatRelativeDate(date)).toBe('3 months ago');
  });

  it('falls back to absolute date for dates over a year ago', () => {
    const date = new Date('2022-01-15T12:00:00Z');
    expect(formatRelativeDate(date)).toMatch(/Jan 15, 2022/);
  });

  it('accepts a string date', () => {
    expect(formatRelativeDate('2024-11-01T11:59:30Z')).toBe('just now');
  });

  it('handles future dates', () => {
    const date = new Date('2024-11-02T12:00:00Z');
    expect(formatRelativeDate(date)).toBe('in 1 day');
  });
});

describe('formatAbsoluteDate', () => {
  it('formats a valid date string', () => {
    expect(formatAbsoluteDate('2024-10-30T14:22:00Z')).toMatch(/Oct 30, 2024/);
  });

  it('formats a Date object', () => {
    expect(formatAbsoluteDate(new Date('2024-01-15T00:00:00Z'))).toMatch(/Jan 1[45], 2024/);
  });

  it('formats different months correctly', () => {
    expect(formatAbsoluteDate('2024-03-05T00:00:00Z')).toMatch(/Mar [45], 2024/);
    expect(formatAbsoluteDate('2024-12-25T00:00:00Z')).toMatch(/Dec 2[45], 2024/);
  });
});

describe('formatPercentage', () => {
  it('formats 0 as "0%"', () => {
    expect(formatPercentage(0)).toBe('0%');
  });

  it('formats 0.5 as "50%"', () => {
    expect(formatPercentage(0.5)).toBe('50%');
  });

  it('formats 1 as "100%"', () => {
    expect(formatPercentage(1)).toBe('100%');
  });

  it('formats a decimal like 0.84 as "84%"', () => {
    expect(formatPercentage(0.84)).toBe('84%');
  });

  it('formats an integer input when isDecimal is false', () => {
    expect(formatPercentage(84, false)).toBe('84%');
  });

  it('rounds fractional percentages', () => {
    expect(formatPercentage(0.846)).toBe('85%');
  });

  it('formats 0 with isDecimal=false as "0%"', () => {
    expect(formatPercentage(0, false)).toBe('0%');
  });
});
