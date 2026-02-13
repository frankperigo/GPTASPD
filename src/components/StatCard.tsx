import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../constants/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  style?: ViewStyle;
  compact?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = colors.primary,
  style,
  compact = false,
}: StatCardProps) {
  return (
    <View style={[styles.card, compact && styles.compact, style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[compact ? styles.valueCompact : styles.value, { color }]}>
        {value}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  compact: {
    padding: spacing.md,
  },
  icon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.hero,
    lineHeight: 56,
  },
  valueCompact: {
    ...typography.h1,
    lineHeight: 40,
  },
  title: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});
