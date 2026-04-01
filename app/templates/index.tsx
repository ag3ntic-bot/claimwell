/**
 * Template Library Screen
 *
 * Browsable template library with category bento grid,
 * search, and featured section for custom approach requests.
 */

import React, { useState, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  Button,
  Card,
  Icon,
  CardSkeleton,
  ErrorState,
} from '@/components/ui';
import { TemplateCategoryCard, TemplateSearchBar } from '@/components/template';
import { colors, spacing, typography } from '@/theme';
import type { TemplateCategory } from '@/types';
import { useTemplates } from '@/hooks/queries/useTemplates';

export default function TemplateLibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: templates = [], isLoading, isError, refetch } = useTemplates();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryPress = useCallback(
    (category: TemplateCategory) => {
      const template = templates.find((t) => t.category === category);
      if (template) {
        router.push(`/templates/${template.id}`);
      }
    },
    [router, templates],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerArea}>
            <CardSkeleton />
          </View>
          <CardSkeleton style={styles.skeletonCard} />
          <CardSkeleton style={styles.skeletonCard} />
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ErrorState
          title="Templates unavailable"
          description="Unable to load the template library. Please try again."
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow_back" size={24} color={colors.onSurface} />
        </Pressable>

        {/* Hero */}
        <Text style={styles.headline} accessibilityRole="header">
          Template{'\n'}Library
        </Text>
        <Text style={styles.description}>
          Professional, AI-crafted letter templates for every type of
          consumer claim. Choose a category or search for specific situations.
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TemplateSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Bento Grid */}
        <View style={styles.bentoGrid}>
          {/* Row 1: Large + Small */}
          <View style={styles.bentoRow1}>
            {/* Refunds - Large Card (2/3 width) */}
            <View style={styles.bentoLargeCard}>
              <TemplateCategoryCard
                category="refunds"
                onPress={handleCategoryPress}
              />
            </View>

            {/* Warranty - Small Card (1/3 width) */}
            <View style={styles.bentoSmallCard}>
              <TemplateCategoryCard
                category="warranty"
                onPress={handleCategoryPress}
              />
            </View>
          </View>

          {/* Row 2: Three small cards */}
          <View style={styles.bentoRow2}>
            <View style={styles.bentoThirdCard}>
              <TemplateCategoryCard
                category="subscription"
                onPress={handleCategoryPress}
              />
            </View>
            <View style={styles.bentoThirdCard}>
              <TemplateCategoryCard
                category="delivery"
                onPress={handleCategoryPress}
              />
            </View>
            <View style={styles.bentoThirdCard}>
              <TemplateCategoryCard
                category="appeals"
                onPress={handleCategoryPress}
                featured
              />
            </View>
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Card style={styles.featuredCard}>
            <View style={styles.featuredIconCircle}>
              <Icon name="star" size={28} color={colors.primary} />
            </View>
            <Text style={styles.featuredHeading}>
              Need a custom approach?
            </Text>
            <Text style={styles.featuredDescription}>
              Our AI can create a personalized draft letter tailored to your
              specific situation, company, and claim type.
            </Text>
            <Button
              variant="primary"
              label="Request Custom Draft"
              icon="edit"
              onPress={() => router.push('/(tabs)/new-claim/' as never)}
              fullWidth
              accessibilityLabel="Request a custom AI draft"
            />
          </Card>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
    marginLeft: -spacing[2],
  },
  headerArea: {
    paddingTop: spacing[6],
  },
  headline: {
    ...typography.displaySm,
    fontWeight: '800',
    color: colors.onSurface,
    marginBottom: spacing[3],
  },
  description: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[6],
    lineHeight: 26,
  },
  searchContainer: {
    marginBottom: spacing[6],
  },
  bentoGrid: {
    gap: spacing[3],
  },
  bentoRow1: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  bentoLargeCard: {
    flex: 2,
  },
  bentoSmallCard: {
    flex: 1,
  },
  bentoRow2: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  bentoThirdCard: {
    flex: 1,
  },
  featuredSection: {
    marginTop: spacing[8],
  },
  featuredCard: {
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  featuredIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[5],
  },
  featuredHeading: {
    ...typography.headlineSm,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  featuredDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing[6],
    maxWidth: 300,
  },
  bottomSpacer: {
    height: spacing[12],
  },
  skeletonCard: {
    marginTop: spacing[4],
  },
});
