/**
 * Claim Detail Screen
 *
 * Main claim detail with 5 internal tabs:
 * Overview, Evidence, Timeline, Strategy, Drafts.
 * Uses local state for tab management.
 */

import React, { useState, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  Badge,
  Button,
  Card,
  Icon,
  ProgressBar,
  ErrorState,
  CardSkeleton,
} from '@/components/ui';
import {
  AISummaryCard,
  ClaimStatusBadge,
  EvidenceGrid,
  TimelineList,
  StrategyCard,
  EscalationLadder,
  WinProbability,
} from '@/components/claim';
import { ToneSelector, AIReasoningCard, DraftEditor } from '@/components/draft';
import { SectionHeader } from '@/components/common';
import { colors, spacing, typography } from '@/theme';
import { mockStrategy, mockDraft, mockTimelineEvents } from '@/testing/fixtures';
import { useClaim } from '@/hooks/queries/useClaim';
import { useEvidence } from '@/hooks/queries/useEvidence';
import type { DraftTone } from '@/types';

type TabKey = 'overview' | 'evidence' | 'timeline' | 'strategy' | 'drafts';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'drafts', label: 'Drafts' },
];

export default function ClaimDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedTone, setSelectedTone] = useState<DraftTone>('assertive');
  const [refreshing, setRefreshing] = useState(false);

  const { data: claim, isLoading, isError, refetch } = useClaim(id);
  const { data: claimEvidence = [] } = useEvidence(id);
  // Strategy, draft, timeline — keep mocks until backend endpoints are built
  const strategy = mockStrategy;
  const draft = mockDraft;
  const timelineEvents = mockTimelineEvents;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const formattedDate = claim
    ? new Date(claim.updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const strengthLabel = claim
    ? (claim.strength >= 75 ? 'High' : claim.strength >= 50 ? 'Medium' : 'Low')
    : 'Low';

  if (isLoading || !claim) {
    return (
      <View style={styles.screen}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <CardSkeleton />
          </View>
          <View style={{ marginTop: spacing[6] }}>
            <CardSkeleton />
          </View>
          <View style={{ marginTop: spacing[4] }}>
            <CardSkeleton />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screen}>
        <ErrorState
          title="Unable to load claim"
          description="We couldn't retrieve the claim details. Please try again."
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  // -- Tab Content Renderers --

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* AI Summary */}
      <AISummaryCard
        summary={strategy.aiSummary}
        keyPoints={[
          'Device is within one-year warranty period',
          'Display defect consistent with known manufacturing issue',
          'Support agent contradiction is strong leverage',
          'No diagnostic report provided with denial',
        ]}
      />

      {/* Bento Grid */}
      <View style={styles.bentoGrid}>
        {/* Strongest Evidence */}
        <View style={styles.bentoHalf}>
          <Card style={styles.bentoCard}>
            <View style={styles.bentoIconRow}>
              <Icon name="verified" size={20} color={colors.primary} />
            </View>
            <Text style={styles.bentoTitle}>Strongest Evidence</Text>
            <Text style={styles.bentoBody}>
              Photo of display defect shows no physical damage. Receipt confirms
              warranty coverage.
            </Text>
          </Card>
        </View>

        {/* Missing Items */}
        <View style={styles.bentoHalf}>
          <Card style={styles.bentoCard}>
            <View style={styles.bentoIconRow}>
              <Icon name="warning" size={20} color={colors.tertiary} />
            </View>
            <Text style={styles.bentoTitle}>Missing Items</Text>
            <Text style={styles.bentoBody}>
              No written diagnostic report from Apple. Request one to strengthen
              your position.
            </Text>
          </Card>
        </View>
      </View>

      {/* Next Action */}
      <Card style={styles.nextActionCard}>
        <View style={styles.bentoIconRow}>
          <Icon name="arrow_forward" size={20} color={colors.primary} />
        </View>
        <Text style={styles.bentoTitle}>Next Action</Text>
        <Text style={styles.bentoBody}>{strategy.recommendedAction}</Text>
        <Button
          variant="primary"
          label="View Strategy"
          icon="insights"
          onPress={() => setActiveTab('strategy')}
          style={styles.nextActionCta}
          accessibilityLabel="View strategy for this claim"
        />
      </Card>

      {/* Win Probability */}
      <View style={styles.overviewRow}>
        <View style={styles.overviewWinProb}>
          <WinProbability
            probability={strategy.claimStrength}
            description="Based on evidence strength and similar resolved cases"
          />
        </View>
      </View>
    </View>
  );

  const renderEvidenceTab = () => (
    <View style={styles.tabContent}>
      <EvidenceGrid
        evidence={claimEvidence}
        onUploadPress={() => {
          // Upload handler placeholder
        }}
      />
    </View>
  );

  const renderTimelineTab = () => (
    <View style={styles.tabContent}>
      <TimelineList events={timelineEvents} />
    </View>
  );

  const renderStrategyTab = () => (
    <View style={styles.tabContent}>
      {/* Days left badge */}
      {strategy.daysLeftToAppeal != null && (
        <Badge
          label={`${strategy.daysLeftToAppeal} days left to appeal`}
          variant="tertiary"
          icon="schedule"
          style={styles.deadlineBadge}
        />
      )}

      {/* Strategy title */}
      <Text style={styles.strategyTitle}>
        {claim.title} Strategy
      </Text>

      {/* Recommended Action */}
      <StrategyCard
        strategy={strategy}
        onGenerateLetter={() => setActiveTab('drafts')}
        onViewTemplates={() => router.push('/templates')}
      />

      {/* Case Analysis */}
      <View style={styles.caseAnalysisGrid}>
        <Card style={styles.caseAnalysisCard}>
          <Text style={styles.caseAnalysisLabel}>Claim Strength</Text>
          <Text style={styles.caseAnalysisValue}>{strategy.claimStrength}%</Text>
          <ProgressBar
            progress={strategy.claimStrength / 100}
            variant="primary"
            style={styles.caseAnalysisBar}
          />
        </Card>

        <Card style={styles.caseAnalysisCard}>
          <Text style={styles.caseAnalysisLabel}>Attention Required</Text>
          <View style={styles.attentionList}>
            {strategy.attentionItems
              .filter((item) => item.priority === 'high')
              .slice(0, 2)
              .map((item, index) => (
                <View key={index} style={styles.attentionItem}>
                  <Icon
                    name={item.icon}
                    size={16}
                    color={colors.error}
                    style={styles.attentionIcon}
                  />
                  <Text
                    style={styles.attentionText}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                </View>
              ))}
          </View>
        </Card>
      </View>

      {/* Escalation Ladder */}
      <View style={styles.escalationSection}>
        <SectionHeader title="Escalation Path" />
        <EscalationLadder steps={strategy.escalationLadder} />
      </View>
    </View>
  );

  const renderDraftsTab = () => (
    <View style={styles.tabContent}>
      {/* Tone Selector */}
      <View style={styles.toneSection}>
        <Text style={styles.toneSectionLabel}>Tone</Text>
        <ToneSelector
          selectedTone={selectedTone}
          onSelect={setSelectedTone}
        />
      </View>

      {/* AI Reasoning */}
      <View style={styles.reasoningSection}>
        <AIReasoningCard reasoning={draft.aiReasoning} />
      </View>

      {/* Draft Editor */}
      <DraftEditor
        content={draft.content}
        version={draft.version}
        onCopy={() => {
          // Copy handler placeholder
        }}
        onSave={() => {
          // Save handler placeholder
        }}
        onRegenerate={() => {
          // Regenerate handler placeholder
        }}
      />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'evidence':
        return renderEvidenceTab();
      case 'timeline':
        return renderTimelineTab();
      case 'strategy':
        return renderStrategyTab();
      case 'drafts':
        return renderDraftsTab();
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Pressable
            onPress={() => router.push('/claims')}
            accessibilityRole="link"
            accessibilityLabel="Go back to Claims"
          >
            <Text style={styles.breadcrumbLink}>Claims</Text>
          </Pressable>
          <Icon name="chevron_right" size={14} color={colors.onSurfaceVariant} />
          <Text style={styles.breadcrumbCurrent}>Active Cases</Text>
        </View>

        {/* Title Section */}
        <View style={styles.headerSection}>
          <Text style={styles.claimTitle}>{claim.title}</Text>
          <View style={styles.statusRow}>
            <ClaimStatusBadge status={claim.status} />
            <Badge
              label={`${strengthLabel} Strength`}
              variant={
                strengthLabel === 'High'
                  ? 'primary'
                  : strengthLabel === 'Medium'
                    ? 'tertiary'
                    : 'error'
              }
              style={styles.strengthBadge}
            />
          </View>
          <Text style={styles.updatedDate}>
            Last updated {formattedDate}
          </Text>
        </View>

        {/* CTA Bar */}
        <View style={styles.ctaBar}>
          <Button
            variant="secondary"
            label="Contact Agent"
            icon="chat"
            accessibilityLabel="Contact support agent"
          />
          <Button
            variant="primary"
            label="Submit Appeal"
            icon="gavel"
            onPress={() => setActiveTab('drafts')}
            accessibilityLabel="Submit appeal for this claim"
          />
        </View>

        {/* Tab Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, isActive && styles.tabActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${tab.label} tab`}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Bottom padding */}
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
    paddingTop: spacing[16],
  },

  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  breadcrumbLink: {
    ...typography.bodySm,
    color: colors.primary,
  },
  breadcrumbCurrent: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },

  // Header
  headerSection: {
    paddingBottom: spacing[4],
  },
  claimTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
    marginBottom: spacing[3],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  strengthBadge: {
    marginLeft: spacing[1],
  },
  updatedDate: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },

  // CTA Bar
  ctaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
  },

  // Tab Bar
  tabBar: {
    marginBottom: spacing[4],
  },
  tabBarContent: {
    gap: spacing[1],
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  tab: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    ...typography.labelLg,
    color: colors.onSurfaceVariant,
  },
  tabLabelActive: {
    color: colors.primary,
  },

  // Tab Content
  tabContent: {
    paddingTop: spacing[2],
  },

  // Overview
  bentoGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  bentoHalf: {
    flex: 1,
  },
  bentoCard: {
    padding: spacing[5],
  },
  bentoIconRow: {
    marginBottom: spacing[3],
  },
  bentoTitle: {
    ...typography.titleSm,
    color: colors.onSurface,
    marginBottom: spacing[1],
  },
  bentoBody: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  nextActionCard: {
    marginTop: spacing[3],
    padding: spacing[5],
  },
  nextActionCta: {
    marginTop: spacing[4],
    alignSelf: 'flex-start',
  },
  overviewRow: {
    marginTop: spacing[4],
  },
  overviewWinProb: {},

  // Strategy
  deadlineBadge: {
    marginBottom: spacing[4],
  },
  strategyTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
    marginBottom: spacing[5],
  },
  caseAnalysisGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[5],
  },
  caseAnalysisCard: {
    flex: 1,
    padding: spacing[5],
  },
  caseAnalysisLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing[2],
  },
  caseAnalysisValue: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing[3],
  },
  caseAnalysisBar: {
    marginTop: spacing[1],
  },
  attentionList: {
    gap: spacing[3],
    marginTop: spacing[1],
  },
  attentionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  attentionIcon: {
    marginRight: spacing[2],
    marginTop: 2,
  },
  attentionText: {
    ...typography.bodySm,
    color: colors.onSurface,
    flex: 1,
  },
  escalationSection: {
    marginTop: spacing[6],
  },

  // Drafts
  toneSection: {
    marginBottom: spacing[4],
  },
  toneSectionLabel: {
    ...typography.labelLg,
    color: colors.onSurface,
    marginBottom: spacing[3],
  },
  reasoningSection: {
    marginBottom: spacing[5],
  },

  // Common
  bottomSpacer: {
    height: spacing[12],
  },
});
