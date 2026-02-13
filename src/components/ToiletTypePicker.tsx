import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ToiletType } from '../types';
import { toiletTypeLabels } from '../constants/bristolScale';
import { colors, borderRadius, spacing, typography } from '../constants/theme';

interface ToiletTypePickerProps {
  selected: ToiletType | null;
  onSelect: (type: ToiletType) => void;
}

const toiletTypes: ToiletType[] = ['home', 'work', 'public', 'friend', 'other'];

export function ToiletTypePicker({ selected, onSelect }: ToiletTypePickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Where?</Text>
      <View style={styles.row}>
        {toiletTypes.map((type) => {
          const info = toiletTypeLabels[type];
          const isSelected = selected === type;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(type)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{info.emoji}</Text>
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {info.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F5EDE3',
  },
  emoji: {
    fontSize: 16,
  },
  chipText: {
    ...typography.caption,
    color: colors.textLight,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.primary,
  },
});
