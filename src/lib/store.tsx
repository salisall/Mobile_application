import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { dayKey } from './dates';
import type { AppState, Category, Goal } from './types';

const STORAGE_KEY = 'manifest-tracker/state/v1';
const EMPTY: AppState = { version: 1, goals: [], gratitude: [] };

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface NewGoal {
  title: string;
  category: Category;
  why: string;
  affirmation: string;
  targetDate: string | null;
}

interface Store {
  ready: boolean;
  state: AppState;
  addGoal: (g: NewGoal) => string;
  updateGoal: (id: string, patch: Partial<NewGoal>) => void;
  deleteGoal: (id: string) => void;
  toggleCheckIn: (id: string, day?: string) => void;
  setManifested: (id: string, manifested: boolean) => void;
  addSign: (id: string, text: string) => void;
  deleteSign: (goalId: string, signId: string) => void;
  saveGratitude: (day: string, items: string[]) => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as AppState;
          if (parsed?.version === 1) setState(parsed);
        }
      })
      .catch((e) => console.warn('Failed to load saved data', e))
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) => console.warn('Failed to save data', e));
  }, [state]);

  const mapGoal = useCallback((id: string, fn: (g: Goal) => Goal) => {
    setState((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? fn(g) : g)) }));
  }, []);

  const store = useMemo<Store>(
    () => ({
      ready,
      state,
      addGoal: (g) => {
        const id = newId();
        const goal: Goal = {
          id,
          ...g,
          createdAt: new Date().toISOString(),
          manifestedAt: null,
          checkIns: [],
          signs: [],
        };
        setState((s) => ({ ...s, goals: [goal, ...s.goals] }));
        return id;
      },
      updateGoal: (id, patch) => mapGoal(id, (g) => ({ ...g, ...patch })),
      deleteGoal: (id) => setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) })),
      toggleCheckIn: (id, day = dayKey()) =>
        mapGoal(id, (g) => ({
          ...g,
          checkIns: g.checkIns.includes(day)
            ? g.checkIns.filter((d) => d !== day)
            : [...g.checkIns, day].sort(),
        })),
      setManifested: (id, manifested) =>
        mapGoal(id, (g) => ({ ...g, manifestedAt: manifested ? new Date().toISOString() : null })),
      addSign: (id, text) =>
        mapGoal(id, (g) => ({ ...g, signs: [{ id: newId(), date: dayKey(), text }, ...g.signs] })),
      deleteSign: (goalId, signId) =>
        mapGoal(goalId, (g) => ({ ...g, signs: g.signs.filter((s) => s.id !== signId) })),
      saveGratitude: (day, items) =>
        setState((s) => {
          const clean = items.map((i) => i.trim()).filter(Boolean);
          const rest = s.gratitude.filter((e) => e.date !== day);
          const gratitude = clean.length ? [{ date: day, items: clean }, ...rest] : rest;
          gratitude.sort((a, b) => b.date.localeCompare(a.date));
          return { ...s, gratitude };
        }),
    }),
    [ready, state, mapGoal],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
