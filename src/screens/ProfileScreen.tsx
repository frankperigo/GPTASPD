import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import { useStore } from '../store/useStore';
import { AchievementBadge } from '../components/AchievementBadge';
import { Button } from '../components/Button';
import { computeUserStats, timeOfDayLabels } from '../utils/stats';
import { exportData } from '../utils/storage';
import { toiletTypeLabels } from '../constants/bristolScale';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export function ProfileScreen() {
  const { checkIns, achievements, clearAllCheckIns } = useStore();
  const stats = computeUserStats(checkIns);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleExport = useCallback(async () => {
    try {
      const data = await exportData();
      await Share.share({
        message: data,
        title: 'ASPD Data Export',
      });
    } catch {
      Alert.alert('Export Failed', 'Could not export your data. Please try again.');
    }
  }, []);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your check-ins and achievements. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => clearAllCheckIns(),
        },
      ]
    );
  }, [clearAllCheckIns]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Profile</Text>

      {/* Stats Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryEmoji}>{'\u{1F9D1}'}</Text>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>Your Journey</Text>
            <Text style={styles.summarySubtitle}>
              {stats.totalCheckIns} visits logged
            </Text>
          </View>
        </View>

        <View style={styles.summaryStats}>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{stats.averageLast7Days}</Text>
            <Text style={styles.summaryStatLabel}>7-day avg</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{stats.averageLast30Days}</Text>
            <Text style={styles.summaryStatLabel}>30-day avg</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{stats.currentStreak}d</Text>
            <Text style={styles.summaryStatLabel}>Streak</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{stats.longestStreak}d</Text>
            <Text style={styles.summaryStatLabel}>Best</Text>
          </View>
        </View>

        {checkIns.length > 0 && (
          <View style={styles.funFacts}>
            <Text style={styles.funFactText}>
              Most active: {timeOfDayLabels[stats.mostCommonTime]}
            </Text>
            <Text style={styles.funFactText}>
              Favorite spot: {toiletTypeLabels[stats.mostCommonLocation].emoji}{' '}
              {toiletTypeLabels[stats.mostCommonLocation].label}
            </Text>
          </View>
        )}
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.sectionBadge}>
            {unlockedCount}/{achievements.length}
          </Text>
        </View>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <AchievementBadge achievement={achievement} />
            </View>
          ))}
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingsGroup}>
          <Button
            title="Export Data (JSON)"
            onPress={handleExport}
            variant="outline"
            style={styles.settingsButton}
          />

          <Button
            title="Clear All Data"
            onPress={handleClearData}
            variant="ghost"
            style={styles.settingsButton}
            textStyle={{ color: colors.error }}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>ASPD</Text>
        <Text style={styles.aboutSubtitle}>Average Shits Per Day</Text>
        <Text style={styles.aboutVersion}>Version 1.0.0</Text>
        <Text style={styles.aboutDesc}>
          Your friendly daily health tracker. Track your visits, understand your patterns, and
          maintain a healthy routine.
        </Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  summaryEmoji: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    ...typography.h2,
    color: colors.text,
  },
  summarySubtitle: {
    ...typography.body,
    color: colors.textLight,
    marginTop: 2,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    ...typography.h2,
    color: colors.primary,
  },
  summaryStatLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  funFacts: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs,
  },
  funFactText: {
    ...typography.caption,
    color: colors.textLight,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionBadge: {
    ...typography.bodyBold,
    color: colors.primary,
    backgroundColor: '#F5EDE3',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  achievementsGrid: {
    gap: spacing.sm,
  },
  achievementItem: {
    width: '100%',
  },
  settingsGroup: {
    gap: spacing.sm,
  },
  settingsButton: {
    width: '100%',
  },
  aboutSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
  },
  aboutTitle: {
    ...typography.h2,
    color: colors.primary,
  },
  aboutSubtitle: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: 2,
  },
  aboutVersion: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  aboutDesc: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  bottomPadding: {
    height: 100,
  },
});
