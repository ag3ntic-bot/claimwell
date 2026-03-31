/**
 * GlassHeader component
 *
 * Sticky header with glassmorphism effect.
 * Semi-transparent surfaceBright bg + backdrop blur simulated via rgba bg.
 * Optional ghost border bottom.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

export interface GlassHeaderProps {
  /** Header content. If not provided, renders default layout slots. */
  children?: React.ReactNode;
  /** Show ghost border at bottom. Default false. */
  showBorder?: boolean;
  /** Optional title text for default layout */
  title?: string;
  /** Left side content (e.g. avatar) */
  left?: React.ReactNode;
  /** Right side content (e.g. notification bell) */
  right?: React.ReactNode;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  children,
  showBorder = false,
  title,
  left,
  right,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing[2] },
        showBorder && styles.borderBottom,
        style,
      ]}
      accessibilityRole="header"
    >
      {children ?? (
        <View style={styles.defaultLayout}>
          <View style={styles.leftSlot}>{left}</View>
          <View style={styles.centerSlot}>
            {title ? (
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
          </View>
          <View style={styles.rightSlot}>{right}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Glassmorphism simulation: semi-transparent white bg
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingBottom: spacing[3],
    paddingHorizontal: spacing[5],
    // On web, real backdrop-filter could be applied via style override
    ...Platform.select({
      ios: {
        // iOS supports backdrop-blur via BlurView; rgba bg simulates it
      },
      android: {
        // Android: rely on rgba bg
      },
      default: {},
    }),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: `${colors.outlineVariant}26`, // 15% opacity
  },
  defaultLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftSlot: {
    flexShrink: 0,
    marginRight: spacing[3],
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
  },
  rightSlot: {
    flexShrink: 0,
    marginLeft: spacing[3],
  },
  title: {
    ...typography.titleLg,
    color: colors.onSurface,
  },
});
