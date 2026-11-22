# Manifest ✨

A manifestation tracker for iPhone and Android, built with Expo (SDK 58) and Expo Router.

## Features

- **Today**: a daily affirmation, a one-tap check-in for each intention ("I visualized it today") and today's gratitude.
- **Intentions**: write goals in the present tense and give each one an area of life, a "why", a personal affirmation and an optional timeframe. Filter by *Manifesting* or *Manifested*.
- **Intention detail**: current and best streak, a 4-week check-in calendar (tap a day to fill in a missed check-in), a log of signs and synchronicities, a "🌟 It manifested!" button, and edit or delete.
- **Gratitude**: a daily "3 things" journal with past entries.
- **Progress**: totals, best streak, a chart of check-ins over the last 7 days, and progress by area of life.
- Light and dark mode, haptic feedback, and everything stored on the device (AsyncStorage). No account needed.

## Run it

```bash
npm install
```

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone. On iPhone, use the Camera app. On Android, scan from inside Expo Go.
Press `i` for the iOS simulator, `a` for the Android emulator or `w` for the web.

## Build for the stores

```bash
npx eas-cli@latest build --platform all
```

Bundle IDs are set in `app.json` (`com.salisall.manifest`).

## Project layout

```
src/app/            screens (Expo Router: each file is a route)
  (tabs)/           Today, Intentions, Gratitude, Progress
  goal/new.tsx      create an intention (modal)
  goal/[id].tsx     intention detail
  goal/edit/[id].tsx
src/components/     shared UI
src/lib/            store (AsyncStorage), dates/streaks, theme, affirmations
```

Check types with `npm run typecheck`.
