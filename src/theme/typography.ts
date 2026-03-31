import { Platform, TextStyle } from 'react-native';

const FONT_HEADLINE = Platform.select({
  ios: 'Manrope',
  android: 'Manrope',
  default: 'System',
});

const FONT_BODY = Platform.select({
  ios: 'Inter',
  android: 'Inter',
  default: 'System',
});

/** System font fallbacks used when custom fonts have not loaded yet. */
export const systemFallbackFonts = {
  headline: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  })!,
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  })!,
} as const;

export const fontFamilies = {
  headline: FONT_HEADLINE,
  body: FONT_BODY,
  label: FONT_BODY,
} as const;

type TypographyVariant = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
};

export const typography: Record<string, TypographyVariant> = {
  displayLg: {
    fontFamily: FONT_HEADLINE!,
    fontSize: 56,
    lineHeight: 62,
    fontWeight: '800',
  },
  displayMd: {
    fontFamily: FONT_HEADLINE!,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '800',
  },
  displaySm: {
    fontFamily: FONT_HEADLINE!,
    fontSize: 36,
    lineHeight: 43,
    fontWeight: '700',
  },
  headlineLg: {
    fontFamily: FONT_HEADLINE!,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  headlineMd: {
    fontFamily: FONT_HEADLINE!,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
  headlineSm: {
    fontFamily: FONT_HEADLINE!,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  titleLg: {
    fontFamily: FONT_HEADLINE!,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
  },
  titleMd: {
    fontFamily: FONT_BODY!,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  titleSm: {
    fontFamily: FONT_BODY!,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: FONT_BODY!,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
  },
  bodyMd: {
    fontFamily: FONT_BODY!,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodySm: {
    fontFamily: FONT_BODY!,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  labelLg: {
    fontFamily: FONT_BODY!,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  labelMd: {
    fontFamily: FONT_BODY!,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  labelSm: {
    fontFamily: FONT_BODY!,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
} as const;

export type TypographyToken = keyof typeof typography;
