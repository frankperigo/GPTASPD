import { BristolScale } from '../types';

export interface BristolScaleInfo {
  type: BristolScale;
  label: string;
  description: string;
  emoji: string;
}

export const bristolScaleData: BristolScaleInfo[] = [
  { type: 1, label: 'Type 1', description: 'Separate hard lumps', emoji: '🫘' },
  { type: 2, label: 'Type 2', description: 'Lumpy sausage', emoji: '🥜' },
  { type: 3, label: 'Type 3', description: 'Cracked sausage', emoji: '🌽' },
  { type: 4, label: 'Type 4', description: 'Smooth & soft', emoji: '🍌' },
  { type: 5, label: 'Type 5', description: 'Soft blobs', emoji: '🫐' },
  { type: 6, label: 'Type 6', description: 'Fluffy pieces', emoji: '☁️' },
  { type: 7, label: 'Type 7', description: 'Entirely liquid', emoji: '💧' },
];

export const toiletTypeLabels: Record<string, { label: string; emoji: string }> = {
  home: { label: 'Home', emoji: '🏠' },
  work: { label: 'Work', emoji: '🏢' },
  public: { label: 'Public', emoji: '🚻' },
  friend: { label: "Friend's", emoji: '👋' },
  other: { label: 'Other', emoji: '📍' },
};
