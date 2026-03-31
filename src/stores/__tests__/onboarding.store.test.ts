jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { useOnboardingStore } from '../onboarding.store';

describe('useOnboardingStore', () => {
  beforeEach(() => {
    useOnboardingStore.setState({
      hasCompletedOnboarding: false,
      currentStep: 0,
    });
  });

  it('has initial state with onboarding not completed', () => {
    const state = useOnboardingStore.getState();
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.currentStep).toBe(0);
  });

  it('setStep changes the current step', () => {
    useOnboardingStore.getState().setStep(2);
    expect(useOnboardingStore.getState().currentStep).toBe(2);
  });

  it('setStep can go to any valid step', () => {
    useOnboardingStore.getState().setStep(0);
    expect(useOnboardingStore.getState().currentStep).toBe(0);

    useOnboardingStore.getState().setStep(3);
    expect(useOnboardingStore.getState().currentStep).toBe(3);
  });

  it('completeOnboarding sets hasCompletedOnboarding to true', () => {
    useOnboardingStore.getState().completeOnboarding();
    expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
  });

  it('hydrate restores persisted onboarding state', () => {
    // First complete onboarding (persists to storage)
    useOnboardingStore.getState().completeOnboarding();

    // Reset in-memory state
    useOnboardingStore.setState({ hasCompletedOnboarding: false });

    // Hydrate should restore from storage
    useOnboardingStore.getState().hydrate();
    expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
  });
});
