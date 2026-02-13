import { create } from 'zustand';
import { CheckIn, Achievement } from '../types';
import { loadCheckIns, saveCheckIns, loadAchievements, saveAchievements } from '../utils/storage';
import { achievementDefinitions } from '../constants/achievements';
import { calculateStreak, getMorningCheckInCount, calculateAverage } from '../utils/stats';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  checkIns: CheckIn[];
  achievements: Achievement[];
  isLoading: boolean;
  onboardingComplete: boolean;

  // Actions
  initialize: () => Promise<void>;
  addCheckIn: (checkIn: Omit<CheckIn, 'id'>) => Promise<void>;
  deleteCheckIn: (id: string) => Promise<void>;
  clearAllCheckIns: () => Promise<void>;
  setOnboardingComplete: (complete: boolean) => void;
  loadSampleData: (data: CheckIn[]) => Promise<void>;
}

function evaluateAchievements(checkIns: CheckIn[], existing: Achievement[]): Achievement[] {
  const existingMap = new Map(existing.map((a) => [a.id, a]));
  const now = new Date().toISOString();
  const streak = calculateStreak(checkIns);
  const morningCount = getMorningCheckInCount(checkIns);
  const avg7 = calculateAverage(checkIns, 7);

  return achievementDefinitions.map((def) => {
    const prev = existingMap.get(def.id);
    if (prev?.unlocked) return prev;

    let unlocked = false;
    switch (def.id) {
      case 'getting_started':
        unlocked = checkIns.length >= 1;
        break;
      case 'consistent':
        unlocked = streak.longest >= 7;
        break;
      case 'dedicated':
        unlocked = streak.longest >= 30;
        break;
      case 'morning_person':
        unlocked = morningCount >= 10;
        break;
      case 'regular':
        unlocked = avg7 >= 1 && checkIns.length >= 7;
        break;
    }

    return {
      ...def,
      unlocked,
      unlockedAt: unlocked ? now : undefined,
    };
  });
}

export const useStore = create<AppState>((set, get) => ({
  checkIns: [],
  achievements: [],
  isLoading: true,
  onboardingComplete: false,

  initialize: async () => {
    const [checkIns, achievements] = await Promise.all([loadCheckIns(), loadAchievements()]);
    const { isOnboardingComplete } = await import('../utils/storage');
    const onboardingDone = await isOnboardingComplete();

    const evaluated = evaluateAchievements(checkIns, achievements);
    set({
      checkIns,
      achievements: evaluated,
      isLoading: false,
      onboardingComplete: onboardingDone,
    });
  },

  addCheckIn: async (checkInData) => {
    const checkIn: CheckIn = { ...checkInData, id: uuidv4() };
    const newCheckIns = [checkIn, ...get().checkIns];
    const achievements = evaluateAchievements(newCheckIns, get().achievements);
    await Promise.all([saveCheckIns(newCheckIns), saveAchievements(achievements)]);
    set({ checkIns: newCheckIns, achievements });
  },

  deleteCheckIn: async (id) => {
    const newCheckIns = get().checkIns.filter((ci) => ci.id !== id);
    await saveCheckIns(newCheckIns);
    set({ checkIns: newCheckIns });
  },

  clearAllCheckIns: async () => {
    const { clearAllData } = await import('../utils/storage');
    await clearAllData();
    set({
      checkIns: [],
      achievements: achievementDefinitions.map((d) => ({ ...d, unlocked: false })),
    });
  },

  setOnboardingComplete: (complete) => {
    set({ onboardingComplete: complete });
  },

  loadSampleData: async (data) => {
    const merged = [...data, ...get().checkIns];
    const achievements = evaluateAchievements(merged, get().achievements);
    await Promise.all([saveCheckIns(merged), saveAchievements(achievements)]);
    set({ checkIns: merged, achievements });
  },
}));
