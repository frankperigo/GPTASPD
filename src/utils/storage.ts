import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckIn, Achievement } from '../types';

const STORAGE_KEYS = {
  CHECK_INS: '@aspd_check_ins',
  ACHIEVEMENTS: '@aspd_achievements',
  ONBOARDING_COMPLETE: '@aspd_onboarding_complete',
};

export async function loadCheckIns(): Promise<CheckIn[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECK_INS);
  if (!data) return [];
  return JSON.parse(data);
}

export async function saveCheckIns(checkIns: CheckIn[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
}

export async function loadAchievements(): Promise<Achievement[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  if (!data) return [];
  return JSON.parse(data);
}

export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return value === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.CHECK_INS,
    STORAGE_KEYS.ACHIEVEMENTS,
  ]);
}

export async function exportData(): Promise<string> {
  const checkIns = await loadCheckIns();
  const achievements = await loadAchievements();
  return JSON.stringify({ checkIns, achievements, exportedAt: new Date().toISOString() }, null, 2);
}
