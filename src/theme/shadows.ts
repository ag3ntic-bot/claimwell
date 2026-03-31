/**
 * Platform-aware shadow utilities
 *
 * Provides cross-platform shadow styles:
 * - iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * - Android: elevation
 */

import { Platform, ViewStyle } from 'react-native';
import { shadows, type ShadowToken } from './tokens';

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

/**
 * Returns platform-specific shadow styles for a given token.
 *
 * On iOS, returns the full shadow* properties.
 * On Android, returns only the elevation property.
 * On other platforms, returns a minimal fallback.
 */
export function platformShadow(token: ShadowToken): ViewStyle {
  const shadow: ShadowStyle = shadows[token];

  return Platform.select({
    ios: {
      shadowColor: shadow.shadowColor,
      shadowOffset: shadow.shadowOffset,
      shadowOpacity: shadow.shadowOpacity,
      shadowRadius: shadow.shadowRadius,
    },
    android: {
      elevation: shadow.elevation,
    },
    default: {
      // Web or other platforms: use elevation for React Native Web compatibility
      elevation: shadow.elevation,
    },
  }) as ViewStyle;
}

/**
 * Pre-computed platform shadows for direct use in StyleSheet.create.
 */
export const platformShadows = {
  ambient: platformShadow('ambient'),
  ambientMd: platformShadow('ambientMd'),
  hover: platformShadow('hover'),
  elevated: platformShadow('elevated'),
} as const;
