export type ToiletType = 'home' | 'work' | 'public' | 'friend' | 'other';
export type BristolScale = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type ExperienceRating = 1 | 2 | 3 | 4 | 5;
export type TimePeriod = 7 | 30 | 90;
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface CheckIn {
  id: string;
  timestamp: string; // ISO string for serialization
  location?: string;
  toiletType: ToiletType;
  bristolScale: BristolScale;
  experienceRating: ExperienceRating;
  notes?: string;
}

export interface DailyCount {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  totalCheckIns: number;
  averageLast7Days: number;
  averageLast30Days: number;
  currentStreak: number;
  longestStreak: number;
  mostCommonTime: TimeOfDay;
  mostCommonLocation: ToiletType;
}
