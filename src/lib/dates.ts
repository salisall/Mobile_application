/** Local-calendar date key, e.g. "2026-11-22". */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Last `n` day keys, oldest first, ending today. */
export function lastNDays(n: number, today: Date = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => dayKey(addDays(today, i - (n - 1))));
}

/** Consecutive days with a check-in, ending today (or yesterday, so a streak isn't "lost" before you've checked in today). */
export function currentStreak(checkIns: string[], today: Date = new Date()): number {
  const set = new Set(checkIns);
  let cursor = today;
  if (!set.has(dayKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (set.has(dayKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(checkIns: string[]): number {
  if (checkIns.length === 0) return 0;
  const sorted = [...new Set(checkIns)].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const expected = dayKey(addDays(parseDayKey(sorted[i - 1]), 1));
    run = sorted[i] === expected ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

export function daysBetween(fromKey: string, toKey: string): number {
  const ms = parseDayKey(toKey).getTime() - parseDayKey(fromKey).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatDay(key: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }): string {
  return parseDayKey(key).toLocaleDateString(undefined, opts);
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
