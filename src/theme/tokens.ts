/**
 * Claimwell Design Tokens
 * Source of truth: designs/DESIGN.md ("The Serene Advocate")
 */

export const colors = {
  primary: '#4B5F7E',
  primaryDim: '#3F5371',
  primaryContainer: '#D4E3FF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#1A2A4A',

  secondary: '#4E607C',
  secondaryContainer: '#D4E3FF',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#1A2A4A',

  tertiary: '#7D5731',
  tertiaryContainer: '#FAC898',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#4A2E12',

  error: '#9F403D',
  errorContainer: '#FE8983',
  onError: '#FFFFFF',
  onErrorContainer: '#5C1A18',

  surface: '#F9F9F9',
  surfaceBright: '#FFFFFF',
  surfaceDim: '#F0F2F2',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F2F4F4',
  surfaceContainer: '#EBEEEF',
  surfaceContainerHigh: '#E3E6E7',
  surfaceContainerHighest: '#DBDEE0',
  surfaceVariant: '#DDE4E5',

  onSurface: '#2D3435',
  onSurfaceVariant: '#5A6061',

  outline: '#8A9192',
  outlineVariant: '#C4CBCC',
} as const;

export const radii = {
  none: 0,
  sm: 4,
  md: 12,
  lg: 8,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const shadows = {
  ambient: {
    shadowColor: '#2D3435',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 2,
  },
  ambientMd: {
    shadowColor: '#2D3435',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
  },
  hover: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 5,
  },
  elevated: {
    shadowColor: '#2D3435',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
} as const;

export type ColorToken = keyof typeof colors;
export type ShadowToken = keyof typeof shadows;
