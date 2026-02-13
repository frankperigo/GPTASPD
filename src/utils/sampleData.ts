import { CheckIn, BristolScale, ExperienceRating, ToiletType } from '../types';
import { subDays, subHours, subMinutes, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSampleData(): CheckIn[] {
  const now = new Date();
  const toiletTypes: ToiletType[] = ['home', 'work', 'public', 'friend', 'home', 'home', 'work'];
  const bristolScales: BristolScale[] = [3, 4, 4, 4, 5, 3, 5, 4, 3, 4];
  const ratings: ExperienceRating[] = [3, 4, 4, 5, 3, 4, 5, 4, 3, 4];
  const notes = [
    'Quick and easy',
    'Morning routine',
    'After lunch',
    'Coffee did its thing',
    '',
    'Not bad!',
    '',
    'A+ experience',
    '',
    'Post-workout',
    '',
    'Smooth sailing',
    '',
    '',
  ];

  const sampleEntries: { daysAgo: number; hoursAgo: number }[] = [
    { daysAgo: 0, hoursAgo: 2 },
    { daysAgo: 0, hoursAgo: 8 },
    { daysAgo: 1, hoursAgo: 3 },
    { daysAgo: 1, hoursAgo: 9 },
    { daysAgo: 1, hoursAgo: 14 },
    { daysAgo: 2, hoursAgo: 7 },
    { daysAgo: 2, hoursAgo: 16 },
    { daysAgo: 3, hoursAgo: 8 },
    { daysAgo: 4, hoursAgo: 6 },
    { daysAgo: 4, hoursAgo: 11 },
    { daysAgo: 5, hoursAgo: 9 },
    { daysAgo: 5, hoursAgo: 15 },
    { daysAgo: 6, hoursAgo: 7 },
    { daysAgo: 6, hoursAgo: 13 },
    { daysAgo: 7, hoursAgo: 8 },
  ];

  return sampleEntries.map((entry, i) => {
    const timestamp = subMinutes(
      subHours(subDays(now, entry.daysAgo), entry.hoursAgo),
      Math.floor(Math.random() * 30)
    );

    return {
      id: uuidv4(),
      timestamp: timestamp.toISOString(),
      toiletType: randomItem(toiletTypes),
      bristolScale: randomItem(bristolScales),
      experienceRating: randomItem(ratings),
      notes: randomItem(notes) || undefined,
      location: undefined,
    };
  });
}
