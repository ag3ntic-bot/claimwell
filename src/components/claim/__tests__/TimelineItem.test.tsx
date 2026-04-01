jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { render, screen } from '@/testing/render';
import { TimelineItem } from '../TimelineItem';
import { mockTimelineEvents } from '@/testing/fixtures';

const purchaseEvent = mockTimelineEvents[0]; // claim_created
const _defectEvent = mockTimelineEvents[1]; // evidence_uploaded
const denialEvent = mockTimelineEvents[3]; // denial_received
const followUpEvent = mockTimelineEvents[4]; // follow_up - no attachment

describe('TimelineItem', () => {
  it('renders event title', () => {
    render(<TimelineItem event={purchaseEvent} />);
    expect(screen.getByText('Device Purchased')).toBeTruthy();
  });

  it('renders formatted date', () => {
    render(<TimelineItem event={purchaseEvent} />);
    // date: '2024-10-12T09:30:00Z' -> "Oct 12, 2024"
    expect(screen.getByText('Oct 12, 2024')).toBeTruthy();
  });

  it('renders description', () => {
    render(<TimelineItem event={purchaseEvent} />);
    expect(
      screen.getByText(/iPhone 15 Pro Max.*purchased from Apple Fifth Avenue/),
    ).toBeTruthy();
  });

  it('shows attachment when present', () => {
    render(<TimelineItem event={purchaseEvent} />);
    expect(screen.getByText('apple_receipt_oct2024.pdf')).toBeTruthy();
  });

  it('does not show attachment when not present', () => {
    render(<TimelineItem event={followUpEvent} />);
    // followUpEvent has no attachment
    expect(screen.queryByText(/\.pdf$/)).toBeNull();
    expect(screen.queryByText(/\.jpg$/)).toBeNull();
  });

  it('renders denial event correctly', () => {
    render(<TimelineItem event={denialEvent} />);
    expect(screen.getByText('Initial Claim Denied')).toBeTruthy();
    expect(screen.getByText('Oct 29, 2024')).toBeTruthy();
    expect(screen.getByText('apple_denial_oct29.eml')).toBeTruthy();
  });

  it('renders follow-up event with description', () => {
    render(<TimelineItem event={followUpEvent} />);
    expect(screen.getByText('Follow-Up Appeal Drafted')).toBeTruthy();
    expect(
      screen.getByText(/Claimwell generated a formal appeal letter/),
    ).toBeTruthy();
  });

  it('has accessibility label combining title, date, and description', () => {
    render(<TimelineItem event={purchaseEvent} />);
    const item = screen.getByTestId('timeline-item');
    expect(item.props.accessibilityLabel).toContain('Device Purchased');
    expect(item.props.accessibilityLabel).toContain('Oct 12, 2024');
  });
});
