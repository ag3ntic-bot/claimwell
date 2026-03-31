jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { render, screen, fireEvent } from '@/testing/render';
import { Input } from '../Input';

describe('Input', () => {
  it('renders placeholder text', () => {
    render(<Input placeholder="Enter company name" />);
    expect(screen.getByPlaceholderText('Enter company name')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    render(<Input placeholder="Type here" onChangeText={onChangeText} />);

    const input = screen.getByPlaceholderText('Type here');
    fireEvent.changeText(input, 'Apple Inc.');

    expect(onChangeText).toHaveBeenCalledWith('Apple Inc.');
  });

  it('shows label when provided', () => {
    render(<Input label="Company Name" placeholder="Enter name" />);
    expect(screen.getByText('Company Name')).toBeTruthy();
  });

  it('shows error message when error prop is set', () => {
    render(<Input placeholder="Amount" error="Amount must be positive" />);
    expect(screen.getByText('Amount must be positive')).toBeTruthy();
  });

  it('does not show error text when error is undefined', () => {
    render(<Input placeholder="Amount" />);
    expect(screen.queryByText('Amount must be positive')).toBeNull();
  });

  it('renders with a controlled value', () => {
    render(<Input placeholder="Name" value="Apple" onChangeText={jest.fn()} />);
    const input = screen.getByPlaceholderText('Name');
    expect(input.props.value).toBe('Apple');
  });

  it('uses label as accessibility label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText('Email')).toBeTruthy();
  });

  it('uses placeholder as accessibility label when no label given', () => {
    render(<Input placeholder="Search claims" />);
    expect(screen.getByLabelText('Search claims')).toBeTruthy();
  });

  it('renders with disabled state', () => {
    render(<Input placeholder="Disabled" editable={false} />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input.props.editable).toBe(false);
  });
});
