import { Achievement } from '../types';

export const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Log your first visit',
    icon: '🎉',
  },
  {
    id: 'consistent',
    title: 'Consistent',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Maintain a 30-day streak',
    icon: '💎',
  },
  {
    id: 'morning_person',
    title: 'Morning Person',
    description: '10 check-ins before 9 AM',
    icon: '🌅',
  },
  {
    id: 'regular',
    title: 'Regular',
    description: 'Average 1+ per day for a week',
    icon: '⭐',
  },
];
