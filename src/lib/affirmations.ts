export const AFFIRMATIONS = [
  'I am a magnet for the things I desire.',
  'Everything I need is already on its way to me.',
  'I am worthy of all the good that is coming.',
  'My thoughts shape my reality, and I choose them with love.',
  'Abundance flows to me easily and often.',
  'I trust the timing of my life.',
  'I am becoming the person who already has what I want.',
  'Today I act as if my dreams are already real.',
  'I release doubt and welcome possibility.',
  'I am grateful for what I have and open to receiving more.',
  'The universe is always working in my favor.',
  'I deserve love, success, and peace.',
  'Small steps every day create my big dreams.',
  'I am calm, confident, and aligned with my goals.',
  'What I seek is also seeking me.',
];

/** Same affirmation all day; changes daily. */
export function affirmationForDay(key: string): string {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AFFIRMATIONS[h % AFFIRMATIONS.length];
}
