/**
 * Tab Layout
 *
 * Main bottom tab navigator with 5 tabs:
 * Home, Claims, New (center FAB), Strategy, Profile.
 * Uses the custom BottomTabBar component with glassmorphism styling.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/theme';
import { BottomTabBar } from '@/components/ui';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="claims"
        options={{
          title: 'Claims',
          tabBarLabel: 'Claims',
        }}
      />
      <Tabs.Screen
        name="new-claim"
        options={{
          title: 'New',
          tabBarLabel: 'New',
        }}
      />
      <Tabs.Screen
        name="strategy"
        options={{
          title: 'Strategy',
          tabBarLabel: 'Strategy',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
