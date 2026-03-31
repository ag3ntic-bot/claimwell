/**
 * Formatting utilities for currency, dates, and percentages.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Formats a number as USD currency.
 * @example formatCurrency(1199) => "$1,199"
 * @example formatCurrency(54.99) => "$54.99"
 */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Formats a date as a relative time string (e.g., "2 days ago", "just now").
 * For dates more than 30 days in the past, falls back to absolute format.
 */
export function formatRelativeDate(date: string | Date): string {
  const target = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - target.getTime();

  if (diff < 0) {
    // Future dates
    const absDiff = Math.abs(diff);
    if (absDiff < MINUTE) return 'in a few seconds';
    if (absDiff < HOUR) {
      const mins = Math.floor(absDiff / MINUTE);
      return `in ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    }
    if (absDiff < DAY) {
      const hrs = Math.floor(absDiff / HOUR);
      return `in ${hrs} ${hrs === 1 ? 'hour' : 'hours'}`;
    }
    if (absDiff < WEEK) {
      const days = Math.floor(absDiff / DAY);
      return `in ${days} ${days === 1 ? 'day' : 'days'}`;
    }
    return formatAbsoluteDate(target);
  }

  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diff < DAY) {
    const hrs = Math.floor(diff / HOUR);
    return `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  return formatAbsoluteDate(target);
}

const absoluteFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/**
 * Formats a date as an absolute string (e.g., "Oct 30, 2024").
 */
export function formatAbsoluteDate(date: string | Date): string {
  const target = typeof date === 'string' ? new Date(date) : date;
  return absoluteFormatter.format(target);
}

/**
 * Formats a number as a percentage string.
 * @example formatPercentage(0.84) => "84%"
 * @example formatPercentage(84, false) => "84%"
 * @param value - The value to format.
 * @param isDecimal - If true, multiplies by 100 first. Defaults to true.
 */
export function formatPercentage(value: number, isDecimal = true): string {
  const pct = isDecimal ? Math.round(value * 100) : Math.round(value);
  return `${pct}%`;
}
