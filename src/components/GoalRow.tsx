import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { currentStreak, dayKey } from '../lib/dates';
import { useStore } from '../lib/store';
import { useTheme } from '../lib/theme';
import { categoryInfo, type Goal } from '../lib/types';
import { tap } from './ui';

export function GoalRow({ goal, showCheck = true }: { goal: Goal; showCheck?: boolean }) {
  const t = useTheme();
  const { toggleCheckIn } = useStore();
  const today = dayKey();
  const done = goal.checkIns.includes(today);
  const streak = currentStreak(goal.checkIns);
  const cat = categoryInfo(goal.category);
  const manifested = !!goal.manifestedAt;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/goal/[id]', params: { id: goal.id } })}
      style={({ pressed }) => [styles.row, { backgroundColor: t.card, borderColor: t.border, opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={[styles.emoji, { backgroundColor: manifested ? t.goldSoft : t.primarySoft }]}>
        <Text style={{ fontSize: 22 }}>{manifested ? '🌟' : cat.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={2} style={[styles.title, { color: t.text }]}>
          {goal.title}
        </Text>
        <Text style={{ color: t.muted, fontSize: 13, marginTop: 2 }}>
          {manifested ? 'Manifested ✨' : streak > 0 ? `🔥 ${streak}-day streak` : cat.label}
        </Text>
      </View>
      {showCheck && !manifested && (
        <Pressable
          hitSlop={10}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={`Check in for ${goal.title}`}
          onPress={() => {
            tap();
            toggleCheckIn(goal.id);
          }}
          style={[styles.check, { borderColor: done ? t.primary : t.border, backgroundColor: done ? t.primary : 'transparent' }]}
        >
          {done && <Ionicons name="checkmark" size={20} color={t.onPrimary} />}
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth },
  emoji: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600' },
  check: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
