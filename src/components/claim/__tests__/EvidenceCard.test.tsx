jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { render, screen, fireEvent } from '@/testing/render';
import { EvidenceCard } from '../EvidenceCard';
import { mockEvidence } from '@/testing/fixtures';

const photoEvidence = mockEvidence[0]; // Photo - key_evidence
const receiptEvidence = mockEvidence[1]; // Receipt - ai_verified
const chatLogEvidence = mockEvidence[2]; // Chat log - contradiction, missing_info

describe('EvidenceCard', () => {
  it('renders evidence title', () => {
    render(<EvidenceCard evidence={photoEvidence} />);
    expect(screen.getByText('Display Damage — Flickering & Dead Zones')).toBeTruthy();
  });

  it('renders type label', () => {
    render(<EvidenceCard evidence={receiptEvidence} />);
    expect(screen.getByText('Receipt')).toBeTruthy();
  });

  it('renders flag chips', () => {
    render(<EvidenceCard evidence={chatLogEvidence} />);
    expect(screen.getByText('Contradiction')).toBeTruthy();
    expect(screen.getByText('Missing Info')).toBeTruthy();
  });

  it('renders key_evidence flag', () => {
    render(<EvidenceCard evidence={photoEvidence} />);
    expect(screen.getByText('Key Evidence')).toBeTruthy();
  });

  it('renders AI Summary button for items with summary', () => {
    render(<EvidenceCard evidence={photoEvidence} />);
    expect(screen.getByText('View AI Summary')).toBeTruthy();
  });

  it('does not render AI Summary button when aiSummary is null', () => {
    const noSummaryEvidence = {
      ...photoEvidence,
      aiSummary: null,
    };
    render(<EvidenceCard evidence={noSummaryEvidence} />);
    expect(screen.queryByText('View AI Summary')).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<EvidenceCard evidence={receiptEvidence} onPress={onPress} />);

    fireEvent.press(screen.getByLabelText(/Evidence: Apple Store Purchase Receipt/));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(receiptEvidence);
  });

  it('has correct accessibility label', () => {
    render(<EvidenceCard evidence={receiptEvidence} />);
    const button = screen.getByLabelText(/Evidence: Apple Store Purchase Receipt/);
    expect(button.props.accessibilityLabel).toContain('Apple Store Purchase Receipt');
    expect(button.props.accessibilityLabel).toContain('Receipt');
  });
});
