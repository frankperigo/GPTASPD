import {
  startOfDay,
  subDays,
  differenceInCalendarDays,
  parseISO,
  format,
  getHours,
  isAfter,
  isBefore,
  startOfToday,
  eachDayOfInterval,
} from 'date-fns';
import { CheckIn, DailyCount, TimeOfDay, ToiletType, UserStats } from '../types';

export function getCheckInsForPeriod(checkIns: CheckIn[], days: number): CheckIn[] {
  const cutoff = subDays(startOfToday(), days);
  return checkIns.filter((ci) => isAfter(parseISO(ci.timestamp), cutoff));
}

export function getTodayCheckIns(checkIns: CheckIn[]): CheckIn[] {
  const todayStart = startOfDay(new Date());
  return checkIns.filter((ci) => isAfter(parseISO(ci.timestamp), todayStart));
}

export function getDailyCounts(checkIns: CheckIn[], days: number): DailyCount[] {
  const today = startOfToday();
  const startDate = subDays(today, days - 1);
  const interval = eachDayOfInterval({ start: startDate, end: today });

  const countMap = new Map<string, number>();
  checkIns.forEach((ci) => {
    const dateKey = format(parseISO(ci.timestamp), 'yyyy-MM-dd');
    countMap.set(dateKey, (countMap.get(dateKey) || 0) + 1);
  });

  return interval.map((date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return { date: dateKey, count: countMap.get(dateKey) || 0 };
  });
}

export function calculateAverage(checkIns: CheckIn[], days: number): number {
  const periodCheckIns = getCheckInsForPeriod(checkIns, days);
  if (days === 0) return 0;
  return Math.round((periodCheckIns.length / days) * 10) / 10;
}

export function calculateStreak(checkIns: CheckIn[]): { current: number; longest: number } {
  if (checkIns.length === 0) return { current: 0, longest: 0 };

  const sorted = [...checkIns].sort(
    (a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()
  );

  const daysWithCheckIns = new Set<string>();
  sorted.forEach((ci) => {
    daysWithCheckIns.add(format(parseISO(ci.timestamp), 'yyyy-MM-dd'));
  });

  const sortedDays = Array.from(daysWithCheckIns).sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');

  // Current streak
  let current = 0;
  let checkDate = today;
  // Allow today or yesterday as start
  if (sortedDays[0] === today || sortedDays[0] === format(subDays(new Date(), 1), 'yyyy-MM-dd')) {
    for (const day of sortedDays) {
      if (day === checkDate) {
        current++;
        checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
      } else if (isBefore(parseISO(day), parseISO(checkDate))) {
        break;
      }
    }
  }

  // Longest streak
  let longest = 0;
  let tempStreak = 1;
  const allDays = Array.from(daysWithCheckIns).sort();
  for (let i = 1; i < allDays.length; i++) {
    if (differenceInCalendarDays(parseISO(allDays[i]), parseISO(allDays[i - 1])) === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);

  return { current, longest: Math.max(current, longest) };
}

export function getTimeOfDay(date: Date): TimeOfDay {
  const hour = getHours(date);
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getMostCommonTimeOfDay(checkIns: CheckIn[]): TimeOfDay {
  if (checkIns.length === 0) return 'morning';

  const counts: Record<TimeOfDay, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };

  checkIns.forEach((ci) => {
    const tod = getTimeOfDay(parseISO(ci.timestamp));
    counts[tod]++;
  });

  return (Object.entries(counts) as [TimeOfDay, number][]).sort((a, b) => b[1] - a[1])[0][0];
}

export function getMostCommonLocation(checkIns: CheckIn[]): ToiletType {
  if (checkIns.length === 0) return 'home';

  const counts: Record<string, number> = {};
  checkIns.forEach((ci) => {
    counts[ci.toiletType] = (counts[ci.toiletType] || 0) + 1;
  });

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as ToiletType;
}

export function getMorningCheckInCount(checkIns: CheckIn[]): number {
  return checkIns.filter((ci) => {
    const hour = getHours(parseISO(ci.timestamp));
    return hour < 9;
  }).length;
}

export function computeUserStats(checkIns: CheckIn[]): UserStats {
  const streak = calculateStreak(checkIns);
  return {
    totalCheckIns: checkIns.length,
    averageLast7Days: calculateAverage(checkIns, 7),
    averageLast30Days: calculateAverage(checkIns, 30),
    currentStreak: streak.current,
    longestStreak: streak.longest,
    mostCommonTime: getMostCommonTimeOfDay(checkIns),
    mostCommonLocation: getMostCommonLocation(checkIns),
  };
}

export function getBristolDistribution(checkIns: CheckIn[]): number[] {
  const dist = [0, 0, 0, 0, 0, 0, 0];
  checkIns.forEach((ci) => {
    dist[ci.bristolScale - 1]++;
  });
  return dist;
}

export const timeOfDayLabels: Record<TimeOfDay, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};
