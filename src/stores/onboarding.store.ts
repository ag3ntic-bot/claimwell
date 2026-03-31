import { create } from 'zustand';
import { getItem, setItem } from '@/services/storage/mmkv';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  setStep: (step: number) => void;
  completeOnboarding: () => void;
  hydrate: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedOnboarding: false,
  currentStep: 0,

  setStep: (step) => set({ currentStep: step }),

  completeOnboarding: () => {
    setItem('onboardingComplete', true);
    set({ hasCompletedOnboarding: true });
  },

  hydrate: () => {
    const completed = getItem('onboardingComplete');
    if (completed) {
      set({ hasCompletedOnboarding: true });
    }
  },
}));
