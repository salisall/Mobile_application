import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { StoreProvider, useStore } from '../lib/store';
import { useTheme } from '../lib/theme';

function Gate() {
  const { ready } = useStore();
  const t = useTheme();
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.bg }}>
        <ActivityIndicator color={t.primary} />
      </View>
    );
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.primary,
        headerTitleStyle: { color: t.text },
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="goal/new" options={{ title: 'New intention', presentation: 'modal' }} />
      <Stack.Screen name="goal/[id]" options={{ title: '' }} />
      <Stack.Screen name="goal/edit/[id]" options={{ title: 'Edit intention', presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const t = useTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider value={{ ...base, colors: { ...base.colors, primary: t.primary, background: t.bg, card: t.bg, text: t.text, border: t.border } }}>
      <StoreProvider>
        <Gate />
        <StatusBar style="auto" />
      </StoreProvider>
    </ThemeProvider>
  );
}
