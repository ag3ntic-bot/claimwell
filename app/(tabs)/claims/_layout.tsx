/**
 * Claims Stack Layout
 *
 * Stack navigator for the claims list and individual claim detail screens.
 * No header - each screen renders its own custom GlassHeader.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function ClaimsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
