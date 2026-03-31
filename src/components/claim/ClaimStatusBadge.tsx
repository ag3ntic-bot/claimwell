/**
 * ClaimStatusBadge
 *
 * Renders a Chip with the appropriate variant and label for a given ClaimStatus.
 */

import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { Chip, ChipSize, ChipVariant } from '@/components/ui';
import { ClaimStatus, CLAIM_STATUS_META } from '@/types';

export interface ClaimStatusBadgeProps {
  /** The current claim status */
  status: ClaimStatus;
  /** Chip size. Default 'md'. */
  size?: ChipSize;
  /** Optional style overrides */
  style?: StyleProp<ViewStyle>;
}

export const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({
  status,
  size = 'md',
  style,
}) => {
  const meta = CLAIM_STATUS_META[status];

  return (
    <Chip
      label={meta.label}
      variant={meta.variant as ChipVariant}
      size={size}
      style={style}
      accessibilityLabel={`Status: ${meta.label}`}
    />
  );
};
