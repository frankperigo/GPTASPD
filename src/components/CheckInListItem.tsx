import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { CheckIn } from '../types';
import { bristolScaleData, toiletTypeLabels } from '../constants/bristolScale';
import { colors, borderRadius, spacing, typography } from '../constants/theme';

interface CheckInListItemProps {
  checkIn: CheckIn;
  onDelete?: (id: string) => void;
}

export function CheckInListItem({ checkIn, onDelete }: CheckInListItemProps) {
  const date = parseISO(checkIn.timestamp);
  const bristol = bristolScaleData[checkIn.bristolScale - 1];
  const location = toiletTypeLabels[checkIn.toiletType];

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.emoji}>{bristol.emoji}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.time}>{format(date, 'h:mm a')}</Text>
          <Text style={styles.date}>{format(date, 'MMM d')}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detail}>
            {location.emoji} {location.label}
          </Text>
          <Text style={styles.detail}>
            {'\u2605'.repeat(checkIn.experienceRating)}
            {'\u2606'.repeat(5 - checkIn.experienceRating)}
          </Text>
        </View>
        {checkIn.notes && <Text style={styles.notes}>{checkIn.notes}</Text>}
      </View>
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(checkIn.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteText}>\u00D7</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  leftSection: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5EDE3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  time: {
    ...typography.bodyBold,
    color: colors.text,
  },
  date: {
    ...typography.small,
    color: colors.textMuted,
  },
  details: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detail: {
    ...typography.small,
    color: colors.textLight,
  },
  notes: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  deleteText: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: '300',
  },
});
