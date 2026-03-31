/**
 * Resolved Claims Layout
 *
 * Stack navigator for resolved claim detail screens.
 */

import React from 'react';
import { Stack } from 'expo-router';

export default function ResolvedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
