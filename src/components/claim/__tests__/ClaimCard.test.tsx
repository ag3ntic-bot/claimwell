jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { render, screen, fireEvent } from '@/testing/render';
import { ClaimCard } from '../ClaimCard';
import { mockClaims } from '@/testing/fixtures';

const claim = mockClaims[0]; // iPhone claim - appealing, $1,199, 65%

describe('ClaimCard', () => {
  it('renders claim title', () => {
    render(<ClaimCard claim={claim} />);
    expect(screen.getByText('Damaged iPhone 15 Pro Max')).toBeTruthy();
  });

  it('renders status badge', () => {
    render(<ClaimCard claim={claim} />);
    // ClaimStatusBadge renders via Chip with label from CLAIM_STATUS_META
    expect(screen.getByText('Appealing')).toBeTruthy();
  });

  it('renders progress percentage', () => {
    render(<ClaimCard claim={claim} />);
    expect(screen.getByText('65%')).toBeTruthy();
  });

  it('renders progress bar', () => {
    render(<ClaimCard claim={claim} />);
    expect(screen.getByTestId('progressbar')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<ClaimCard claim={claim} onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(claim);
  });

  it('shows formatted amount', () => {
    render(<ClaimCard claim={claim} />);
    // ClaimCard formats as $1,199
    expect(screen.getByText('$1,199')).toBeTruthy();
  });

  it('shows formatted date', () => {
    render(<ClaimCard claim={claim} />);
    // createdAt: '2024-10-12T09:30:00Z' -> "Oct 12, 2024"
    expect(screen.getByText('Oct 12, 2024')).toBeTruthy();
  });

  it('renders resolved claim with 100% progress', () => {
    const resolvedClaim = mockClaims[3]; // Sony - resolved, 100%
    render(<ClaimCard claim={resolvedClaim} />);
    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText('Resolved')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    render(<ClaimCard claim={claim} />);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toContain('Damaged iPhone 15 Pro Max');
    expect(button.props.accessibilityLabel).toContain('appealing');
    expect(button.props.accessibilityLabel).toContain('65%');
  });
});
