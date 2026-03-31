/**
 * Root Layout
 *
 * Loads custom fonts, configures providers (TanStack Query, SafeArea),
 * and sets up the root Stack navigator for (auth) and (tabs) groups.
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { hydrateStorage } from '@/services/storage/mmkv';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    hydrateStorage().then(() => setStorageReady(true));
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    // Variable fonts that support all weights
    Manrope: require('../assets/fonts/Manrope-Variable.ttf'),
    'Manrope-Medium': require('../assets/fonts/Manrope-Variable.ttf'),
    'Manrope-SemiBold': require('../assets/fonts/Manrope-Variable.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-Variable.ttf'),
    'Manrope-ExtraBold': require('../assets/fonts/Manrope-Variable.ttf'),
    Inter: require('../assets/fonts/Inter-Variable.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Variable.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-Variable.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Variable.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if ((!fontsLoaded && !fontError) || !storageReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
