import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { setOnboardingComplete } from '../utils/storage';
import { generateSampleData } from '../utils/sampleData';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingPage {
  emoji: string;
  title: string;
  description: string;
  backgroundColor: string;
}

const pages: OnboardingPage[] = [
  {
    emoji: '\u{1F44B}',
    title: 'Welcome to ASPD',
    description:
      'Your friendly daily health tracker. Monitor your bathroom habits, understand your patterns, and maintain a healthy routine.',
    backgroundColor: '#FAF7F2',
  },
  {
    emoji: '\u{1F4CA}',
    title: 'Track & Analyze',
    description:
      'Log your visits with just a tap. View beautiful charts of your trends, discover your peak times, and earn fun achievements along the way.',
    backgroundColor: '#F0F5EE',
  },
  {
    emoji: '\u{1F512}',
    title: 'Private & Secure',
    description:
      "All your data stays on your device. No accounts, no cloud sync, no tracking. Your health data is yours alone. Let's get started!",
    backgroundColor: '#EDF4F8',
  },
];

export function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { setOnboardingComplete: setStoreOnboarding, loadSampleData } = useStore();

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGetStarted = async () => {
    if (isFinishing) return;

    setIsFinishing(true);

    try {
      const sampleData = generateSampleData();
      await loadSampleData(sampleData);
    } finally {
      await setOnboardingComplete();
      setStoreOnboarding(true);
      setIsFinishing(false);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const renderPage = ({ item }: { item: OnboardingPage }) => (
    <View style={[styles.page, { width: SCREEN_WIDTH, backgroundColor: item.backgroundColor }]}>
      <View style={styles.pageContent}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.pageTitle}>{item.title}</Text>
        <Text style={styles.pageDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const isLastPage = currentPage === pages.length - 1;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(_, index) => index.toString()}
      />

      {/* Page Dots */}
      <View style={styles.dotsContainer}>
        {pages.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentPage && styles.dotActive]} />
        ))}
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isLastPage ? "Let's Go!" : 'Next'}
          onPress={isLastPage ? handleGetStarted : handleNext}
          variant="primary"
          size="large"
          loading={isFinishing}
          disabled={isFinishing}
          style={styles.button}
        />
        {!isLastPage && (
          <Button
            title="Skip"
            onPress={handleGetStarted}
            variant="ghost"
            size="medium"
            disabled={isFinishing}
            style={styles.skipButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  pageContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  pageTitle: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pageDescription: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  skipButton: {
    marginTop: spacing.sm,
  },
});
