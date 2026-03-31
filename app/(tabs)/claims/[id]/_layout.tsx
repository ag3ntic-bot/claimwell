/**
 * Claim Detail Layout
 *
 * Stack layout for the claim detail view. The claim detail screen
 * internally manages its own tabs (Overview, Evidence, Timeline,
 * Strategy, Drafts) via local state rather than nested navigators.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function ClaimDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
