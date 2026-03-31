jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

import React from 'react';
import { render, screen, fireEvent } from '@/testing/render';
import { Button } from '../Button';

describe('Button', () => {
  it('renders primary variant correctly', () => {
    render(<Button label="Submit Claim" />);
    expect(screen.getByText('Submit Claim')).toBeTruthy();
  });

  it('renders secondary variant', () => {
    render(<Button label="Cancel" variant="secondary" />);
    expect(screen.getByText('Cancel')).toBeTruthy();
  });

  it('renders tertiary variant', () => {
    render(<Button label="Learn More" variant="tertiary" />);
    expect(screen.getByText('Learn More')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button label="Press Me" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading', () => {
    render(<Button label="Loading" loading />);

    // ActivityIndicator should be present; label should still render
    expect(screen.getByText('Loading')).toBeTruthy();
    // The button should be disabled when loading
    const button = screen.getByRole('button');
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ busy: true }),
    );
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    render(<Button label="Disabled" disabled onPress={onPress} />);

    const button = screen.getByRole('button');
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );

    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress when loading', () => {
    const onPress = jest.fn();
    render(<Button label="Loading" loading onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders icon when provided', () => {
    render(<Button label="Add" icon="add" />);
    // Icon renders as MaterialCommunityIcons, the button label should still be present
    expect(screen.getByText('Add')).toBeTruthy();
  });

  it('has correct accessibility props', () => {
    render(<Button label="Submit" accessibilityLabel="Submit your claim" />);

    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Submit your claim');
  });

  it('uses label as default accessibility label', () => {
    render(<Button label="Submit Claim" />);

    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Submit Claim');
  });
});
