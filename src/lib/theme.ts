import { useColorScheme } from 'react-native';

const light = {
  bg: '#FAF7FF',
  card: '#FFFFFF',
  text: '#1F1A2E',
  muted: '#6E6787',
  border: '#E8E1F5',
  primary: '#7C4DFF',
  primarySoft: '#EFE8FF',
  onPrimary: '#FFFFFF',
  gold: '#E0A526',
  goldSoft: '#FFF4DC',
  success: '#2E9E6A',
  danger: '#D64545',
};

const dark: typeof light = {
  bg: '#120F1C',
  card: '#1D1930',
  text: '#F2EEFF',
  muted: '#A49CC0',
  border: '#2E2847',
  primary: '#A98BFF',
  primarySoft: '#2C2450',
  onPrimary: '#140F24',
  gold: '#F2C14E',
  goldSoft: '#3A3020',
  success: '#5BD19A',
  danger: '#FF7A7A',
};

export type Palette = typeof light;

export function useTheme(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}
