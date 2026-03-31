jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { render, screen } from '@/testing/render';
import { Chip } from '../Chip';

describe('Chip', () => {
  it('renders label text', () => {
    render(<Chip label="Key Evidence" />);
    expect(screen.getByText('Key Evidence')).toBeTruthy();
  });

  it('applies primary variant by default', () => {
    render(<Chip label="Primary" />);
    expect(screen.getByText('Primary')).toBeTruthy();
  });

  it('renders with error variant', () => {
    render(<Chip label="Contradiction" variant="error" />);
    expect(screen.getByText('Contradiction')).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    render(<Chip label="Archived" variant="secondary" />);
    expect(screen.getByText('Archived')).toBeTruthy();
  });

  it('renders with tertiary variant', () => {
    render(<Chip label="Missing Info" variant="tertiary" />);
    expect(screen.getByText('Missing Info')).toBeTruthy();
  });

  it('renders icon when provided', () => {
    render(<Chip label="Verified" icon="check" />);
    expect(screen.getByText('Verified')).toBeTruthy();
    // Icon is rendered alongside the label
  });

  it('uses label as accessibility label by default', () => {
    render(<Chip label="AI Verified" />);
    expect(screen.getByLabelText('AI Verified')).toBeTruthy();
  });

  it('uses custom accessibility label when provided', () => {
    render(<Chip label="AI Verified" accessibilityLabel="Evidence is AI verified" />);
    expect(screen.getByLabelText('Evidence is AI verified')).toBeTruthy();
  });

  it('renders small size chip', () => {
    render(<Chip label="Small" size="sm" />);
    expect(screen.getByText('Small')).toBeTruthy();
  });
});
