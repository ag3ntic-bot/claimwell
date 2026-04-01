/**
 * Template Detail Screen
 *
 * Displays a single template with its full content,
 * category badge, and action buttons to use or customize.
 */

import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import {
  Badge,
  Button,
  Card,
  Chip,
  Icon,
  CardSkeleton,
  ErrorState,
  EmptyState,
} from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { TEMPLATE_CATEGORY_META } from '@/types';
import { useTemplates } from '@/hooks/queries/useTemplates';

export default function TemplateDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: templates = [], isLoading, isError } = useTemplates();

  const template = useMemo(
    () => templates.find((t) => t.id === id),
    [templates, id],
  );

  const categoryMeta = template
    ? TEMPLATE_CATEGORY_META[template.category]
    : null;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleUseTemplate = useCallback(() => {
    router.push('/(tabs)/new-claim/' as never);
  }, [router]);

  const handleCustomize = useCallback(() => {
    router.push('/(tabs)/new-claim/' as never);
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
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ErrorState
          title="Template unavailable"
          description="Unable to load this template. Please try again."
          onRetry={() => {}}
        />
      </View>
    );
  }

  if (!template || !categoryMeta) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow_back" size={24} color={colors.onSurface} />
        </Pressable>
        <EmptyState
          icon="description"
          title="Template not found"
          description="The template you are looking for does not exist or has been removed."
          actionLabel="Browse Templates"
          onAction={() => router.push('/templates/')}
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
      >
        {/* Back Button */}
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back to template library"
        >
          <Icon name="arrow_back" size={24} color={colors.onSurface} />
        </Pressable>

        {/* Category Badge */}
        <Badge
          label={categoryMeta.label}
          variant="primary"
          icon={categoryMeta.icon}
          style={styles.categoryBadge}
        />

        {/* Title */}
        <Text style={styles.title} accessibilityRole="header">
          {template.title}
        </Text>

        {/* Description */}
        <Text style={styles.description}>{template.description}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {template.tags.map((tag) => (
            <Chip key={tag} label={tag} size="sm" variant="secondary" />
          ))}
        </View>

        {/* Usage Count */}
        <View style={styles.usageRow}>
          <Icon name="trending_up" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.usageText}>
            Used {template.usageCount.toLocaleString()} times
          </Text>
        </View>

        {/* Template Content */}
        <Card style={styles.contentCard} accessibilityLabel="Template content">
          <View style={styles.contentHeader}>
            <Icon name="description" size={18} color={colors.primary} />
            <Text style={styles.contentHeaderText}>Template Content</Text>
          </View>
          <Text style={styles.contentText} selectable>
            {template.content}
          </Text>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing[4]) }]}>
        <View style={styles.footerGradient} />
        <View style={styles.footerButtons}>
          <Button
            variant="primary"
            label="Use This Template"
            icon="check"
            onPress={handleUseTemplate}
            style={styles.primaryButton}
            accessibilityLabel="Use this template for your claim"
          />
          <Button
            variant="secondary"
            label="Customize with AI"
            icon="star"
            onPress={handleCustomize}
            style={styles.secondaryButton}
            accessibilityLabel="Customize this template with AI"
          />
        </View>
      </View>
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
  categoryBadge: {
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  title: {
    ...typography.headlineLg,
    color: colors.onSurface,
    marginBottom: spacing[3],
  },
  description: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    lineHeight: 26,
    marginBottom: spacing[4],
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    marginBottom: spacing[6],
  },
  usageText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  contentCard: {
    backgroundColor: colors.surfaceContainerLow,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  contentHeaderText: {
    ...typography.titleMd,
    color: colors.primary,
  },
  contentText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 140,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
  },
  footerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    opacity: 0.95,
  },
  footerButtons: {
    gap: spacing[3],
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  skeletonCard: {
    marginTop: spacing[4],
  },
});
