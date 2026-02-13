import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useStore } from '../store/useStore';
import { StatCard } from '../components/StatCard';
import {
  getDailyCounts,
  calculateAverage,
  calculateStreak,
  getMostCommonTimeOfDay,
  getMostCommonLocation,
  getBristolDistribution,
  getCheckInsForPeriod,
  timeOfDayLabels,
} from '../utils/stats';
import { toiletTypeLabels } from '../constants/bristolScale';
import { TimePeriod } from '../types';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_PADDING = spacing.lg * 2 + spacing.md * 2;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING;

export function StatsScreen() {
  const { checkIns } = useStore();
  const [period, setPeriod] = useState<TimePeriod>(7);

  const periodCheckIns = useMemo(() => getCheckInsForPeriod(checkIns, period), [checkIns, period]);
  const dailyCounts = useMemo(() => getDailyCounts(checkIns, period), [checkIns, period]);
  const average = useMemo(() => calculateAverage(checkIns, period), [checkIns, period]);
  const streak = useMemo(() => calculateStreak(checkIns), [checkIns]);
  const mostCommonTime = useMemo(() => getMostCommonTimeOfDay(periodCheckIns), [periodCheckIns]);
  const mostCommonLoc = useMemo(() => getMostCommonLocation(periodCheckIns), [periodCheckIns]);
  const bristolDist = useMemo(() => getBristolDistribution(periodCheckIns), [periodCheckIns]);

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Statistics</Text>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {([7, 30, 90] as TimePeriod[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.periodActive]}
            onPress={() => setPeriod(p)}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
              {p} Days
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {checkIns.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>{'\u{1F4CA}'}</Text>
          <Text style={styles.emptyText}>No data yet</Text>
          <Text style={styles.emptySubtext}>Log some visits to see your stats</Text>
        </View>
      ) : (
        <>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Daily Average"
              value={average}
              icon="\u{1F4C8}"
              color={colors.primary}
              compact
              style={styles.gridItem}
            />
            <StatCard
              title="Peak Time"
              value={timeOfDayLabels[mostCommonTime]}
              icon="\u{23F0}"
              color={colors.accent}
              compact
              style={styles.gridItem}
            />
            <StatCard
              title="Fav Location"
              value={toiletTypeLabels[mostCommonLoc].label}
              icon={toiletTypeLabels[mostCommonLoc].emoji}
              color={colors.secondary}
              compact
              style={styles.gridItem}
            />
            <StatCard
              title="Longest Streak"
              value={`${streak.longest}d`}
              icon="\u{1F3C6}"
              color={colors.warning}
              compact
              style={styles.gridItem}
            />
          </View>

          {/* Daily Trend Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Daily Trend</Text>
            <View style={styles.chart}>
              <View style={styles.chartBars}>
                {dailyCounts.slice(-Math.min(period, 14)).map((day, i) => {
                  const barHeight = maxCount > 0 ? (day.count / maxCount) * 120 : 0;
                  return (
                    <View key={day.date} style={styles.barContainer}>
                      <Text style={styles.barValue}>{day.count > 0 ? day.count : ''}</Text>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: Math.max(barHeight, 4),
                            backgroundColor:
                              day.count > 0 ? colors.primary : colors.border,
                          },
                        ]}
                      />
                      <Text style={styles.barLabel}>
                        {day.date.slice(8)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Bristol Scale Distribution */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Bristol Scale Distribution</Text>
            <View style={styles.bristolChart}>
              {bristolDist.map((count, i) => {
                const maxBristol = Math.max(...bristolDist, 1);
                const width = (count / maxBristol) * 100;
                return (
                  <View key={i} style={styles.bristolRow}>
                    <Text style={styles.bristolLabel}>Type {i + 1}</Text>
                    <View style={styles.bristolBarBg}>
                      <View
                        style={[
                          styles.bristolBar,
                          {
                            width: `${Math.max(width, 2)}%`,
                            backgroundColor: colors.secondary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.bristolCount}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Total for period */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total visits in {period} days</Text>
            <Text style={styles.totalValue}>{periodCheckIns.length}</Text>
          </View>
        </>
      )}

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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  periodActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    ...typography.bodyBold,
    color: colors.textLight,
  },
  periodTextActive: {
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textLight,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  gridItem: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm) / 2 - 1,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  chart: {
    height: 180,
    justifyContent: 'flex-end',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 160,
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    ...typography.small,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '600',
  },
  bar: {
    width: 12,
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 10,
  },
  bristolChart: {
    gap: spacing.sm,
  },
  bristolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bristolLabel: {
    ...typography.small,
    color: colors.textLight,
    width: 48,
    fontWeight: '600',
  },
  bristolBarBg: {
    flex: 1,
    height: 20,
    backgroundColor: '#F0EDE8',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bristolBar: {
    height: '100%',
    borderRadius: 10,
  },
  bristolCount: {
    ...typography.small,
    color: colors.textLight,
    width: 24,
    textAlign: 'right',
    fontWeight: '600',
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  totalLabel: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
  },
  totalValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 56,
  },
  bottomPadding: {
    height: 100,
  },
});
