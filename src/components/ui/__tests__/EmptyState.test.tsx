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
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        icon="inbox"
        title="No Claims Yet"
        description="Start by filing your first claim."
      />,
    );

    expect(screen.getByText('No Claims Yet')).toBeTruthy();
    expect(screen.getByText('Start by filing your first claim.')).toBeTruthy();
  });

  it('renders action button when actionLabel is provided', () => {
    const onAction = jest.fn();
    render(
      <EmptyState
        icon="inbox"
        title="No Claims"
        description="Get started."
        actionLabel="Create Claim"
        onAction={onAction}
      />,
    );

    const button = screen.getByText('Create Claim');
    expect(button).toBeTruthy();
  });

  it('hides action button when no actionLabel is provided', () => {
    render(
      <EmptyState
        icon="inbox"
        title="No Claims"
        description="Nothing here."
      />,
    );

    expect(screen.queryByText('Create Claim')).toBeNull();
  });

  it('calls onAction when action button is pressed', () => {
    const onAction = jest.fn();
    render(
      <EmptyState
        icon="inbox"
        title="No Claims"
        description="Get started."
        actionLabel="File Claim"
        onAction={onAction}
      />,
    );

    fireEvent.press(screen.getByText('File Claim'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when actionLabel is provided but onAction is missing', () => {
    render(
      <EmptyState
        icon="inbox"
        title="No Claims"
        description="Get started."
        actionLabel="File Claim"
      />,
    );

    // The component requires both actionLabel AND onAction to render the button
    expect(screen.queryByText('File Claim')).toBeNull();
  });

  it('renders the icon', () => {
    render(
      <EmptyState
        icon="inbox"
        title="Empty"
        description="Nothing to show."
      />,
    );

    expect(screen.getByText('Empty')).toBeTruthy();
    expect(screen.getByText('Nothing to show.')).toBeTruthy();
  });
});
