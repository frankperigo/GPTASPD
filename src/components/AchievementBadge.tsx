import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '../types';
import { colors, borderRadius, spacing, typography } from '../constants/theme';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <View style={[styles.container, !achievement.unlocked && styles.locked]}>
      <Text style={[styles.icon, !achievement.unlocked && styles.lockedIcon]}>
        {achievement.icon}
      </Text>
      <Text style={[styles.title, !achievement.unlocked && styles.lockedText]}>
        {achievement.title}
      </Text>
      <Text style={[styles.description, !achievement.unlocked && styles.lockedText]}>
        {achievement.description}
      </Text>
      {achievement.unlocked && <Text style={styles.unlocked}>Unlocked!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    width: '100%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  locked: {
    opacity: 0.5,
    backgroundColor: '#F0EDE8',
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  lockedIcon: {
    fontSize: 32,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  lockedText: {
    color: colors.textMuted,
  },
  unlocked: {
    ...typography.small,
    color: colors.success,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
