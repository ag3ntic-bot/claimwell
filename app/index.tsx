/**
 * Entry Redirect
 *
 * Checks onboarding and authentication state, then redirects
 * to the appropriate screen group.
 */

import { Redirect } from 'expo-router';
import { useOnboardingStore, useAuthStore } from '@/stores';

export default function Index() {
  const hasCompletedOnboarding = useOnboardingStore(
    (s) => s.hasCompletedOnboarding,
  );
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(tabs)" />;
}
