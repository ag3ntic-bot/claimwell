/**
 * BottomTabBar component
 *
 * Custom tab bar with glassmorphism bg, rounded-t-2xl.
 * Center tab is a larger primary-colored FAB (New Claim).
 * Compatible with @react-navigation/bottom-tabs.
 */

import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, radii, spacing, shadows, typography } from '@/theme';
import { Icon } from './Icon';

/** Default icon mapping for tabs. Override via screenOptions tabBarIcon. */
const DEFAULT_TAB_ICONS: Record<string, string> = {
  home: 'home',
  index: 'home',
  claims: 'description',
  'new-claim': 'add',
  newClaim: 'add',
  analytics: 'analytics',
  strategy: 'insights',
  profile: 'person',
  settings: 'settings',
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const centerIndex = Math.floor(state.routes.length / 2);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, spacing[2]),
        },
      ]}
      accessibilityRole="tablist"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const isCenter = index === centerIndex;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconName =
          DEFAULT_TAB_ICONS[route.name.toLowerCase()] ??
          DEFAULT_TAB_ICONS[route.name] ??
          'empty';

        if (isCenter) {
          return (
            <CenterTab
              key={route.key}
              iconName={iconName}
              label={label}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            />
          );
        }

        return (
          <TabItem
            key={route.key}
            iconName={iconName}
            label={label}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
          />
        );
      })}
    </View>
  );
};

// -- Regular Tab Item --

interface TabItemProps {
  iconName: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
}

const TabItem: React.FC<TabItemProps> = ({
  iconName,
  label,
  isFocused,
  onPress,
  onLongPress,
  accessibilityLabel,
}) => {
  const color = isFocused ? colors.primary : colors.onSurfaceVariant;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={accessibilityLabel}
    >
      <Icon name={iconName} size={24} color={color} />
      <Text
        style={[
          styles.tabLabel,
          { color },
          isFocused && styles.tabLabelActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
};

// -- Center FAB Tab --

interface CenterTabProps extends TabItemProps {}

const CenterTab: React.FC<CenterTabProps> = ({
  iconName,
  label,
  isFocused,
  onPress,
  onLongPress,
  accessibilityLabel,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={[styles.centerTabWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.centerTab, shadows.elevated]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={accessibilityLabel}
      >
        <Icon name={iconName} size={28} color={colors.onPrimary} />
      </Pressable>
      <Text
        style={[
          styles.tabLabel,
          styles.centerLabel,
          { color: isFocused ? colors.primary : colors.onSurfaceVariant },
          isFocused && styles.tabLabelActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    paddingTop: spacing[2],
    paddingHorizontal: spacing[2],
    ...shadows.ambient,
    // Override shadow to go upward
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[1],
    minHeight: 48,
  },
  tabLabel: {
    ...typography.labelSm,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
  centerTabWrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: -20,
  },
  centerTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    marginTop: 4,
  },
});
