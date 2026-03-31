/**
 * Onboarding / Welcome Screen
 *
 * First screen new users see. Features the Claimwell brand identity,
 * decorative illustration area, feature pills, and CTA buttons.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radii, shadows } from '@/theme';
import { Icon, Button, Chip } from '@/components/ui';
import { useOnboardingStore } from '@/stores';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const handleGetStarted = () => {
    completeOnboarding();
    router.push('/(auth)/sign-in');
  };

  const handleSignIn = () => {
    completeOnboarding();
    router.push('/(auth)/sign-in');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing[6], paddingBottom: insets.bottom + spacing[6] },
      ]}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* Decorative blur elements */}
      <View style={styles.blurCircleTopRight} />
      <View style={styles.blurCircleBottomLeft} />

      {/* Logo */}
      <Text style={styles.logo}>Claimwell</Text>

      {/* Illustration area */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationBg}>
          {/* Layered decorative shapes */}
          <View style={styles.shapeLayer1} />
          <View style={styles.shapeLayer2} />
          <View style={styles.shapeLayer3} />

          {/* Icons */}
          <View style={styles.iconRow}>
            <View style={styles.illustrationIcon}>
              <Icon name="description" size={32} color={colors.primary} />
            </View>
            <View style={styles.illustrationIconAccent}>
              <Icon name="verified" size={32} color={colors.onPrimary} />
            </View>
          </View>
        </View>

        {/* Progress bar decoration */}
        <View style={styles.progressDecoration}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      {/* Headline */}
      <Text style={styles.headline}>
        Get what's yours{'\n'}with Claimwell
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        Upload your insurance documents and let our AI analyze your coverage,
        identify missed claims, and build winning strategies to maximize your
        reimbursements.
      </Text>

      {/* Feature pills */}
      <View style={styles.pillRow}>
        <Chip
          label="Secure Vault"
          icon="security"
          variant="primary"
          style={styles.pill}
        />
        <Chip
          label="AI Analysis"
          icon="psychology"
          variant="secondary"
          style={styles.pill}
        />
      </View>

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          label="Get Started"
          icon="arrow_forward"
          onPress={handleGetStarted}
          fullWidth
        />
      </View>

      {/* Sign in link */}
      <View style={styles.signInRow}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <Pressable onPress={handleSignIn} hitSlop={8}>
          <Text style={styles.signInLink}>Sign In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },

  // Decorative blur elements
  blurCircleTopRight: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${colors.primaryContainer}40`,
  },
  blurCircleBottomLeft: {
    position: 'absolute',
    bottom: 60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `${colors.tertiaryContainer}30`,
  },

  // Logo
  logo: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 24,
    lineHeight: 32,
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: spacing[8],
  },

  // Illustration
  illustrationContainer: {
    width: SCREEN_WIDTH - spacing[12],
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  illustrationBg: {
    width: '100%',
    height: 200,
    borderRadius: radii.xl,
    backgroundColor: `${colors.primaryContainer}20`,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shapeLayer1: {
    position: 'absolute',
    top: 20,
    left: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.primaryContainer}30`,
  },
  shapeLayer2: {
    position: 'absolute',
    bottom: 10,
    right: 40,
    width: 100,
    height: 100,
    borderRadius: radii.xl,
    backgroundColor: `${colors.primaryContainer}25`,
    transform: [{ rotate: '15deg' }],
  },
  shapeLayer3: {
    position: 'absolute',
    top: 40,
    right: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.tertiaryContainer}40`,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  illustrationIcon: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.ambient,
  },
  illustrationIconAccent: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elevated,
  },

  // Progress bar decoration
  progressDecoration: {
    width: '70%',
    marginTop: spacing[4],
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  progressFill: {
    width: '65%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.tertiaryContainer,
  },

  // Headline
  headline: {
    ...typography.displaySm,
    fontFamily: 'Manrope-Bold',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing[3],
  },

  // Description
  description: {
    ...typography.bodyMd,
    fontFamily: 'Inter',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing[6],
    paddingHorizontal: spacing[2],
    lineHeight: 22,
  },

  // Feature pills
  pillRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  pill: {
    borderRadius: radii.full,
  },

  // Pagination dots
  dotsRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[8],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceVariant,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },

  // CTA
  ctaContainer: {
    width: '100%',
    marginBottom: spacing[4],
  },

  // Sign in link
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    ...typography.bodyMd,
    fontFamily: 'Inter',
    color: colors.onSurfaceVariant,
  },
  signInLink: {
    ...typography.bodyMd,
    fontFamily: 'Inter-SemiBold',
    color: colors.primary,
    fontWeight: '600',
  },
});
