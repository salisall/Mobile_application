import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { useTheme } from '../../lib/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function icon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} color={typeof color === 'string' ? color : undefined} size={size} />
  );
}

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.muted,
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        headerStyle: { backgroundColor: t.bg },
        headerTitleStyle: { color: t.text, fontWeight: '700' },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: t.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: icon('sunny-outline') }} />
      <Tabs.Screen name="goals" options={{ title: 'Intentions', tabBarIcon: icon('sparkles-outline') }} />
      <Tabs.Screen name="gratitude" options={{ title: 'Gratitude', tabBarIcon: icon('heart-outline') }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: icon('stats-chart-outline') }} />
    </Tabs>
  );
}
