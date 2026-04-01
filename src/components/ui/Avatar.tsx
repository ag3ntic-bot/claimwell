/**
 * Avatar component
 *
 * Circular user avatar with initials fallback and optional pro gradient border.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, typography } from '@/theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image URI */
  uri?: string;
  /** User name for initials fallback */
  name?: string;
  /** Size preset. Default 'md'. */
  size?: AvatarSize;
  /** Show gradient border for pro users */
  showProBadge?: boolean;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 128,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  sm: 12,
  md: 16,
  lg: 28,
  xl: 44,
};

const PRO_BORDER_WIDTH = 2;

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  showProBadge = false,
  style,
  accessibilityLabel,
}) => {
  const [imageError, setImageError] = useState(false);
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];
  const initials = getInitials(name);
  const showImage = !!uri && !imageError;

  const avatarContent = (
    <View
      style={[
        styles.circle,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
          onError={() => setImageError(true)}
          accessibilityLabel={accessibilityLabel ?? name ?? 'Avatar'}
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]} accessibilityLabel={accessibilityLabel ?? name ?? 'Avatar'}>
          {initials}
        </Text>
      )}
    </View>
  );

  if (showProBadge) {
    const outerDimension = dimension + PRO_BORDER_WIDTH * 2 + 4; // border + gap
    return (
      <View
        style={[
          styles.proBorder,
          {
            width: outerDimension,
            height: outerDimension,
            borderRadius: outerDimension / 2,
          },
          style,
        ]}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel ?? `${name ?? 'User'} (Pro)`}
      >
        {avatarContent}
      </View>
    );
  }

  return (
    <View
      style={style}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name ?? 'Avatar'}
    >
      {avatarContent}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    ...typography.labelLg,
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },
  proBorder: {
    borderWidth: PRO_BORDER_WIDTH,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
