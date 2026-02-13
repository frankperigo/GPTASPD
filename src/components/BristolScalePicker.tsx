import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BristolScale } from '../types';
import { bristolScaleData } from '../constants/bristolScale';
import { colors, borderRadius, spacing, typography } from '../constants/theme';

interface BristolScalePickerProps {
  selected: BristolScale | null;
  onSelect: (scale: BristolScale) => void;
}

export function BristolScalePicker({ selected, onSelect }: BristolScalePickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bristol Scale</Text>
      <View style={styles.grid}>
        {bristolScaleData.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[styles.item, selected === item.type && styles.selected]}
            onPress={() => onSelect(item.type)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.typeLabel, selected === item.type && styles.selectedText]}>
              {item.type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selected && (
        <Text style={styles.description}>
          {bristolScaleData[selected - 1].description}
        </Text>
      )}
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
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: '#F5EDE3',
  },
  emoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  typeLabel: {
    ...typography.small,
    color: colors.textLight,
    fontWeight: '600',
  },
  selectedText: {
    color: colors.primary,
  },
  description: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
