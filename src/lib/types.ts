export type Category =
  | 'love'
  | 'money'
  | 'career'
  | 'health'
  | 'home'
  | 'growth'
  | 'travel'
  | 'other';

export interface Sign {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
}

export interface Goal {
  id: string;
  title: string;
  category: Category;
  why: string;
  affirmation: string;
  createdAt: string; // ISO
  targetDate: string | null; // YYYY-MM-DD
  manifestedAt: string | null; // ISO
  checkIns: string[]; // YYYY-MM-DD, unique, sorted ascending
  signs: Sign[]; // evidence / synchronicities, newest first
}

export interface GratitudeEntry {
  date: string; // YYYY-MM-DD
  items: string[];
}

export interface AppState {
  version: 1;
  goals: Goal[];
  gratitude: GratitudeEntry[]; // newest first
}

export const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'love', label: 'Love', emoji: '💗' },
  { key: 'money', label: 'Money', emoji: '💰' },
  { key: 'career', label: 'Career', emoji: '🚀' },
  { key: 'health', label: 'Health', emoji: '🌿' },
  { key: 'home', label: 'Home', emoji: '🏡' },
  { key: 'growth', label: 'Growth', emoji: '🌱' },
  { key: 'travel', label: 'Travel', emoji: '✈️' },
  { key: 'other', label: 'Other', emoji: '✨' },
];

export function categoryInfo(key: Category) {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];
}
