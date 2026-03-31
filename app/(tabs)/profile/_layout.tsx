/**
 * Profile Section Layout
 *
 * Stack navigator for profile and settings sub-screens.
 */

import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="connected-accounts" />
    </Stack>
  );
}
