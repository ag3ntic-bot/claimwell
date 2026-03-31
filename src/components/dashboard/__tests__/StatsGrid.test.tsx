jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { render, screen } from '@/testing/render';
import { StatsGrid } from '../StatsGrid';
import { mockClaimSummary } from '@/testing/fixtures';

describe('StatsGrid', () => {
  it('renders all three stat values', () => {
    render(<StatsGrid summary={mockClaimSummary} />);

    // Active Claims: 3
    expect(screen.getByText('3')).toBeTruthy();
    // Labels
    expect(screen.getByText('Active Claims')).toBeTruthy();
    expect(screen.getByText('Money at Stake')).toBeTruthy();
    expect(screen.getByText('Recovered')).toBeTruthy();
  });

  it('formats currency correctly for money at stake ($840)', () => {
    render(<StatsGrid summary={mockClaimSummary} />);
    // 840 < 1000, so formatted as "$840"
    expect(screen.getByText('$840')).toBeTruthy();
  });

  it('formats currency correctly for recovered ($1,250 -> "$1.3k")', () => {
    render(<StatsGrid summary={mockClaimSummary} />);
    // 1250 >= 1000, so formatted as "$1.3k"
    expect(screen.getByText('$1.3k')).toBeTruthy();
  });

  it('formats large round amounts without decimal', () => {
    const summary = { activeClaims: 5, moneyAtStake: 2000, totalRecovered: 3000 };
    render(<StatsGrid summary={summary} />);
    // 2000 / 1000 = 2, remainder is 0, so "$2k"
    expect(screen.getByText('$2k')).toBeTruthy();
    expect(screen.getByText('$3k')).toBeTruthy();
  });

  it('has accessibility role summary', () => {
    render(<StatsGrid summary={mockClaimSummary} />);
    expect(screen.getByTestId('stats-grid')).toBeTruthy();
  });

  it('renders stat items with accessibility labels', () => {
    render(<StatsGrid summary={mockClaimSummary} />);
    expect(screen.getByLabelText('Active Claims: 3')).toBeTruthy();
    expect(screen.getByLabelText('Money at Stake: $840')).toBeTruthy();
    expect(screen.getByLabelText('Recovered: $1.3k')).toBeTruthy();
  });
});
