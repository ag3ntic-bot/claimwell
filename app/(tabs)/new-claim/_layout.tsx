/**
 * New Claim Wizard Layout
 *
 * Stack navigator for the multi-step claim creation flow.
 */

import React from 'react';
import { Stack } from 'expo-router';

export default function NewClaimLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="company" />
      <Stack.Screen name="details" />
      <Stack.Screen name="evidence" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
