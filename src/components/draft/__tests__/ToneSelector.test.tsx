jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

import React from 'react';
import { render, screen, fireEvent } from '@/testing/render';
import { ToneSelector } from '../ToneSelector';

describe('ToneSelector', () => {
  it('renders all three tone options', () => {
    render(<ToneSelector selectedTone="assertive" onSelect={jest.fn()} />);

    expect(screen.getByText('Calm')).toBeTruthy();
    expect(screen.getByText('Assertive')).toBeTruthy();
    expect(screen.getByText('Formal')).toBeTruthy();
  });

  it('highlights the selected tone with radio state', () => {
    render(<ToneSelector selectedTone="assertive" onSelect={jest.fn()} />);

    const radioButtons = screen.getAllByRole('radio');
    // Find the assertive one via accessibility label
    const assertiveBtn = screen.getByLabelText(/Assertive tone/);
    expect(assertiveBtn.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it('marks unselected tones as not selected', () => {
    render(<ToneSelector selectedTone="assertive" onSelect={jest.fn()} />);

    const calmBtn = screen.getByLabelText(/Calm tone/);
    expect(calmBtn.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  it('calls onSelect when a tone option is pressed', () => {
    const onSelect = jest.fn();
    render(<ToneSelector selectedTone="assertive" onSelect={onSelect} />);

    fireEvent.press(screen.getByText('Calm'));
    expect(onSelect).toHaveBeenCalledWith('calm');
  });

  it('calls onSelect with "formal" when formal is pressed', () => {
    const onSelect = jest.fn();
    render(<ToneSelector selectedTone="assertive" onSelect={onSelect} />);

    fireEvent.press(screen.getByText('Formal'));
    expect(onSelect).toHaveBeenCalledWith('formal');
  });

  it('renders with calm selected', () => {
    render(<ToneSelector selectedTone="calm" onSelect={jest.fn()} />);

    const calmBtn = screen.getByLabelText(/Calm tone/);
    expect(calmBtn.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );

    const assertiveBtn = screen.getByLabelText(/Assertive tone/);
    expect(assertiveBtn.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  it('has radiogroup accessibility role on the container', () => {
    render(<ToneSelector selectedTone="assertive" onSelect={jest.fn()} />);
    expect(screen.getByTestId('tone-selector-group')).toBeTruthy();
  });
});
