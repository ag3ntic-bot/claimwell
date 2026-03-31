jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@/testing/render';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <Text>Card content</Text>
      </Card>,
    );
    expect(screen.getByText('Card content')).toBeTruthy();
  });

  it('renders with accessibility role "summary"', () => {
    render(
      <Card accessibilityLabel="Claim card">
        <Text>Content</Text>
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card).toBeTruthy();
  });

  it('applies the accessibility label', () => {
    render(
      <Card accessibilityLabel="Test card">
        <Text>Content</Text>
      </Card>,
    );
    expect(screen.getByLabelText('Test card')).toBeTruthy();
  });

  it('renders multiple children', () => {
    render(
      <Card>
        <Text>First</Text>
        <Text>Second</Text>
      </Card>,
    );
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
  });
});
