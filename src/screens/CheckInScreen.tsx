import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';
import { BristolScalePicker } from '../components/BristolScalePicker';
import { StarRating } from '../components/StarRating';
import { ToiletTypePicker } from '../components/ToiletTypePicker';
import { Button } from '../components/Button';
import { ConfettiOverlay } from '../components/ConfettiOverlay';
import { BristolScale, ExperienceRating, ToiletType } from '../types';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export function CheckInScreen({ navigation }: { navigation: any }) {
  const { addCheckIn } = useStore();
  const [toiletType, setToiletType] = useState<ToiletType | null>(null);
  const [bristolScale, setBristolScale] = useState<BristolScale | null>(null);
  const [rating, setRating] = useState<ExperienceRating | null>(null);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [saving, setSaving] = useState(false);

  const isValid = toiletType !== null && bristolScale !== null && rating !== null;

  const handleSubmit = useCallback(async () => {
    if (!isValid || !toiletType || !bristolScale || !rating) return;

    setSaving(true);
    try {
      await addCheckIn({
        timestamp: new Date().toISOString(),
        toiletType,
        bristolScale,
        experienceRating: rating,
        notes: notes.trim() || undefined,
        location: location.trim() || undefined,
      });

      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        navigation.goBack();
      }, 2000);
    } catch {
      Alert.alert('Oops', 'Something went wrong. Please try again.');
      setSaving(false);
    }
  }, [isValid, toiletType, bristolScale, rating, notes, location, addCheckIn, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ConfettiOverlay visible={showConfetti} />

      {showConfetti && (
        <View style={styles.successOverlay}>
          <Text style={styles.successEmoji}>{'\u2705'}</Text>
          <Text style={styles.successTitle}>Logged!</Text>
          <Text style={styles.successSubtitle}>Nice work, keep it up!</Text>
        </View>
      )}

      {!showConfetti && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{'\u{1F6BD}'}</Text>
            <Text style={styles.title}>Log Your Visit</Text>
            <Text style={styles.subtitle}>How was the experience?</Text>
          </View>

          {/* Toilet Type */}
          <ToiletTypePicker selected={toiletType} onSelect={setToiletType} />

          {/* Bristol Scale */}
          <BristolScalePicker selected={bristolScale} onSelect={setBristolScale} />

          {/* Star Rating */}
          <StarRating rating={rating} onRate={setRating} />

          {/* Location (Optional) */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Location (optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Starbucks on Main St"
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={setLocation}
              returnKeyType="next"
            />
          </View>

          {/* Notes (Optional) */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              placeholder="Any thoughts to capture?"
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              returnKeyType="done"
            />
          </View>

          {/* Submit Button */}
          <Button
            title={saving ? 'Saving...' : 'Log Visit'}
            onPress={handleSubmit}
            variant="primary"
            size="large"
            disabled={!isValid || saving}
            loading={saving}
            style={styles.submitButton}
          />

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  inputSection: {
    marginVertical: spacing.sm,
  },
  inputLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: spacing.lg,
    width: '100%',
  },
  successOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h1,
    color: colors.primary,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.sm,
  },
  bottomPadding: {
    height: 40,
  },
});
