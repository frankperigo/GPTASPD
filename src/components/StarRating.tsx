import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ExperienceRating } from '../types';
import { colors, spacing, typography } from '../constants/theme';

interface StarRatingProps {
  rating: ExperienceRating | null;
  onRate: (rating: ExperienceRating) => void;
  label?: string;
  size?: number;
}

const ratingLabels: Record<number, string> = {
  1: 'Terrible',
  2: 'Not great',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent!',
};

export function StarRating({ rating, onRate, label = "How'd it go?", size = 36 }: StarRatingProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.stars}>
        {([1, 2, 3, 4, 5] as ExperienceRating[]).map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRate(star)}
            activeOpacity={0.7}
            style={styles.starButton}
          >
            <Text style={[styles.star, { fontSize: size }]}>
              {rating && star <= rating ? '\u2605' : '\u2606'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {rating && <Text style={styles.ratingLabel}>{ratingLabels[rating]}</Text>}
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
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  star: {
    color: colors.warning,
  },
  ratingLabel: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
