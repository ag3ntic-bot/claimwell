jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { renderHook, act } from '@testing-library/react-native';
import { useClaimForm } from '../useClaimForm';
import { removeItem } from '@/services/storage/mmkv';

describe('useClaimForm', () => {
  beforeEach(() => {
    removeItem('claimDrafts');
  });

  it('initializes at step 0 (first step)', () => {
    const { result } = renderHook(() => useClaimForm());

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.totalSteps).toBe(5);
  });

  it('advances to next step with valid data', async () => {
    const { result } = renderHook(() => useClaimForm());

    // Fill in step 1 fields (title + category)
    await act(async () => {
      result.current.form.setValue('title', 'iPhone 15 Pro Max Display Issue');
      result.current.form.setValue('category', 'warranty');
    });

    let advanced = false;
    await act(async () => {
      advanced = await result.current.next();
    });

    expect(advanced).toBe(true);
    expect(result.current.currentStep).toBe(1);
  });

  it('goes back to previous step', async () => {
    const { result } = renderHook(() => useClaimForm());

    // Fill step 1 and advance
    await act(async () => {
      result.current.form.setValue('title', 'Test Claim Title');
      result.current.form.setValue('category', 'warranty');
    });
    await act(async () => {
      await result.current.next();
    });

    expect(result.current.currentStep).toBe(1);

    act(() => {
      result.current.prev();
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
  });

  it('does not go back past step 0', () => {
    const { result } = renderHook(() => useClaimForm());

    act(() => {
      result.current.prev();
    });

    expect(result.current.currentStep).toBe(0);
  });

  it('validates before advancing and fails with invalid data', async () => {
    const { result } = renderHook(() => useClaimForm());

    // Title is empty (less than 3 chars), should fail
    let advanced = false;
    await act(async () => {
      advanced = await result.current.next();
    });

    expect(advanced).toBe(false);
    expect(result.current.currentStep).toBe(0);
  });

  it('resets form state', async () => {
    const { result } = renderHook(() => useClaimForm());

    // Set some values and advance
    await act(async () => {
      result.current.form.setValue('title', 'My Claim');
      result.current.form.setValue('category', 'refund');
    });
    await act(async () => {
      await result.current.next();
    });

    expect(result.current.currentStep).toBe(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.form.getValues('title')).toBe('');
    expect(result.current.form.getValues('companyName')).toBe('');
  });

  it('goToStep moves to a specific step', () => {
    const { result } = renderHook(() => useClaimForm());

    act(() => {
      result.current.goToStep(3);
    });

    expect(result.current.currentStep).toBe(3);
  });

  it('goToStep does not go out of bounds', () => {
    const { result } = renderHook(() => useClaimForm());

    act(() => {
      result.current.goToStep(10);
    });

    // Should remain at 0 since 10 >= TOTAL_STEPS
    expect(result.current.currentStep).toBe(0);
  });

  it('isLastStep is true at the final step', () => {
    const { result } = renderHook(() => useClaimForm());

    act(() => {
      result.current.goToStep(4);
    });

    expect(result.current.isLastStep).toBe(true);
    expect(result.current.isFirstStep).toBe(false);
  });
});
