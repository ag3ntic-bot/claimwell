jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { render, screen } from '@/testing/render';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders with correct accessibility value for 65% progress', () => {
    render(<ProgressBar progress={0.65} />);

    const bar = screen.getByTestId('progressbar');
    expect(bar).toBeTruthy();
    expect(bar.props.accessibilityValue).toEqual(
      expect.objectContaining({ now: 65, min: 0, max: 100 }),
    );
  });

  it('renders with 0% progress', () => {
    render(<ProgressBar progress={0} />);

    const bar = screen.getByTestId('progressbar');
    expect(bar.props.accessibilityValue.now).toBe(0);
  });

  it('renders with 100% progress', () => {
    render(<ProgressBar progress={1} />);

    const bar = screen.getByTestId('progressbar');
    expect(bar.props.accessibilityValue.now).toBe(100);
  });

  it('clamps progress above 1', () => {
    render(<ProgressBar progress={1.5} />);

    const bar = screen.getByTestId('progressbar');
    expect(bar.props.accessibilityValue.now).toBe(100);
  });

  it('clamps progress below 0', () => {
    render(<ProgressBar progress={-0.5} />);

    const bar = screen.getByTestId('progressbar');
    expect(bar.props.accessibilityValue.now).toBe(0);
  });

  it('renders with default accessibility label', () => {
    render(<ProgressBar progress={0.5} />);

    const bar = screen.getByTestId('progressbar');
    expect(bar.props.accessibilityLabel).toBe('Progress 50%');
  });

  it('renders with custom accessibility label', () => {
    render(<ProgressBar progress={0.5} accessibilityLabel="Claim resolution progress" />);

    expect(screen.getByLabelText('Claim resolution progress')).toBeTruthy();
  });

  it('renders with primary variant by default', () => {
    render(<ProgressBar progress={0.5} />);
    expect(screen.getByTestId('progressbar')).toBeTruthy();
  });

  it('renders with error variant', () => {
    render(<ProgressBar progress={0.3} variant="error" />);
    expect(screen.getByTestId('progressbar')).toBeTruthy();
  });

  it('renders with tertiary variant', () => {
    render(<ProgressBar progress={0.7} variant="tertiary" />);
    expect(screen.getByTestId('progressbar')).toBeTruthy();
  });
});
