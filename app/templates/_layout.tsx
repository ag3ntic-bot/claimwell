/**
 * Templates Section Layout
 *
 * Stack navigator for template library and detail screens.
 */

import React from 'react';
import { Stack } from 'expo-router';

export default function TemplatesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
