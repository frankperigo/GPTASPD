import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useStore } from '../store/useStore';
import { StatCard } from '../components/StatCard';
import { CheckInListItem } from '../components/CheckInListItem';
import { getTodayCheckIns, computeUserStats } from '../utils/stats';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export function HomeScreen() {
  const { checkIns, deleteCheckIn, isLoading, initialize } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const todayCheckIns = getTodayCheckIns(checkIns);
  const stats = computeUserStats(checkIns);
  const recentCheckIns = [...checkIns]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await initialize();
    setRefreshing(false);
  }, [initialize]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteCheckIn(id);
    },
    [deleteCheckIn]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}
        </Text>
        <Text style={styles.subtitle}>Here's your daily digest</Text>
      </View>

      {/* Today's Count - Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>
          {todayCheckIns.length === 0 ? '\u{1F6BD}' : '\u{1F389}'}
        </Text>
        <Text style={styles.heroNumber}>{todayCheckIns.length}</Text>
        <Text style={styles.heroLabel}>
          {todayCheckIns.length === 1 ? 'visit today' : 'visits today'}
        </Text>
        {todayCheckIns.length === 0 && (
          <Text style={styles.heroHint}>Tap the + button to log your first visit</Text>
        )}
      </View>

      {/* Quick Stats Row */}
      <View style={styles.statsRow}>
        <StatCard
          title="7-Day Avg"
          value={stats.averageLast7Days}
          icon="\u{1F4CA}"
          color={colors.primary}
          compact
          style={styles.statCard}
        />
        <StatCard
          title="Streak"
          value={`${stats.currentStreak}d`}
          icon="\u{1F525}"
          color={colors.warning}
          compact
          style={styles.statCard}
        />
        <StatCard
          title="Total"
          value={stats.totalCheckIns}
          icon="\u{2B50}"
          color={colors.accent}
          compact
          style={styles.statCard}
        />
      </View>

      {/* Streak Card */}
      {stats.currentStreak > 0 && (
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>{'\u{1F525}'}</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakTitle}>You're on a roll!</Text>
            <Text style={styles.streakText}>
              {stats.currentStreak} day streak &bull; Keep it going!
            </Text>
          </View>
        </View>
      )}

      {/* Recent Check-ins */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Visits</Text>
        {recentCheckIns.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{'\u{1F4AD}'}</Text>
            <Text style={styles.emptyText}>No visits logged yet</Text>
            <Text style={styles.emptySubtext}>
              Start tracking to see your history here
            </Text>
          </View>
        ) : (
          recentCheckIns.map((ci) => (
            <CheckInListItem key={ci.id} checkIn={ci} onDelete={handleDelete} />
          ))
        )}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  greeting: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  heroNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 80,
  },
  heroLabel: {
    ...typography.h3,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  heroHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#F0E0B0',
  },
  streakEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  streakText: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.bodyBold,
    color: colors.textLight,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  bottomPadding: {
    height: 100,
  },
});
