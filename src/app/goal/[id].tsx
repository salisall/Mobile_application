import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Empty, Input, SectionTitle, tap } from '../../components/ui';
import { currentStreak, dayKey, daysBetween, formatDay, lastNDays, longestStreak } from '../../lib/dates';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme';
import { categoryInfo } from '../../lib/types';

function confirm(title: string, message: string, confirmText: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}

export default function GoalDetailScreen() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, toggleCheckIn, setManifested, addSign, deleteSign, deleteGoal } = useStore();
  const [signText, setSignText] = useState('');
  const goal = state.goals.find((g) => g.id === id);

  if (!goal) return <Empty emoji="🔍" title="Not found" body="This intention no longer exists." />;

  const today = dayKey();
  const cat = categoryInfo(goal.category);
  const done = goal.checkIns.includes(today);
  const manifested = !!goal.manifestedAt;
  const days = lastNDays(28);
  const daysLeft = goal.targetDate ? daysBetween(today, goal.targetDate) : null;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable hitSlop={10} onPress={() => router.push({ pathname: '/goal/edit/[id]', params: { id: goal.id } })}>
              <Text style={{ color: t.primary, fontSize: 16, fontWeight: '600' }}>Edit</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={{ color: t.muted, fontWeight: '600' }}>
          {cat.emoji} {cat.label}
          {daysLeft !== null && !manifested && (daysLeft >= 0 ? ` · ${daysLeft} days to go` : ` · target passed`)}
        </Text>
        <Text style={[styles.title, { color: t.text }]}>{goal.title}</Text>
        {!!goal.why && <Text style={{ color: t.muted, fontSize: 16, lineHeight: 22 }}>{goal.why}</Text>}

        {!!goal.affirmation && (
          <Card style={{ backgroundColor: t.primarySoft, borderColor: t.primarySoft }}>
            <Text style={{ color: t.primary, fontSize: 18, fontWeight: '600', fontStyle: 'italic' }}>“{goal.affirmation}”</Text>
          </Card>
        )}

        {manifested ? (
          <Card style={{ backgroundColor: t.goldSoft, borderColor: t.gold, alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 40 }}>🌟</Text>
            <Text style={{ color: t.text, fontSize: 18, fontWeight: '700' }}>Manifested!</Text>
            <Text style={{ color: t.muted }}>
              {new Date(goal.manifestedAt!).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </Card>
        ) : (
          <Button
            title={done ? '✓ Checked in today' : 'I visualized it today'}
            variant={done ? 'soft' : 'primary'}
            onPress={() => toggleCheckIn(goal.id)}
          />
        )}

        <View style={styles.stats}>
          <MiniStat label="Current streak" value={`🔥 ${currentStreak(goal.checkIns)}`} />
          <MiniStat label="Best streak" value={`${longestStreak(goal.checkIns)}`} />
          <MiniStat label="Check-ins" value={`${goal.checkIns.length}`} />
        </View>

        <SectionTitle>Last 4 weeks</SectionTitle>
        <Card>
          <View style={styles.calendar}>
            {days.map((d) => {
              const on = goal.checkIns.includes(d);
              return (
                <Pressable
                  key={d}
                  accessibilityLabel={`${formatDay(d)}${on ? ', checked in' : ''}`}
                  disabled={manifested}
                  onPress={() => {
                    tap();
                    toggleCheckIn(goal.id, d);
                  }}
                  style={[
                    styles.day,
                    { backgroundColor: on ? t.primary : t.primarySoft },
                    d === today && { borderWidth: 2, borderColor: t.gold },
                  ]}
                >
                  <Text style={{ fontSize: 11, color: on ? t.onPrimary : t.muted }}>{Number(d.slice(8))}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={{ color: t.muted, fontSize: 12, marginTop: 10 }}>Tap a day to fix a missed check-in.</Text>
        </Card>

        <SectionTitle>Signs & synchronicities</SectionTitle>
        <Card style={{ gap: 10 }}>
          <Text style={{ color: t.muted, fontSize: 14 }}>
            Noticed a sign, a coincidence or real progress? Log it here as evidence it's on its way.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Input
              value={signText}
              onChangeText={setSignText}
              placeholder="Saw the perfect listing online"
              style={{ flex: 1 }}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (!signText.trim()) return;
                addSign(goal.id, signText.trim());
                setSignText('');
              }}
            />
            <Pressable
              accessibilityLabel="Add sign"
              disabled={!signText.trim()}
              onPress={() => {
                tap();
                addSign(goal.id, signText.trim());
                setSignText('');
              }}
              style={[styles.addBtn, { backgroundColor: t.primary, opacity: signText.trim() ? 1 : 0.4 }]}
            >
              <Ionicons name="add" size={24} color={t.onPrimary} />
            </Pressable>
          </View>
          {goal.signs.map((s) => (
            <View key={s.id} style={[styles.sign, { borderTopColor: t.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontSize: 15 }}>✨ {s.text}</Text>
                <Text style={{ color: t.muted, fontSize: 12, marginTop: 2 }}>{formatDay(s.date)}</Text>
              </View>
              <Pressable hitSlop={10} accessibilityLabel="Delete sign" onPress={() => deleteSign(goal.id, s.id)}>
                <Ionicons name="close" size={18} color={t.muted} />
              </Pressable>
            </View>
          ))}
        </Card>

        <View style={{ gap: 10, marginTop: 12 }}>
          {manifested ? (
            <Button title="Move back to manifesting" variant="soft" onPress={() => setManifested(goal.id, false)} />
          ) : (
            <Button
              title="🌟 It manifested!"
              variant="soft"
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                setManifested(goal.id, true);
              }}
            />
          )}
          <Button
            title="Delete intention"
            variant="danger"
            onPress={() =>
              confirm('Delete intention?', 'This removes it and all its check-ins.', 'Delete', () => {
                router.back();
                deleteGoal(goal.id);
              })
            }
          />
        </View>
        <Text style={{ color: t.muted, fontSize: 12, textAlign: 'center' }}>
          Set on {formatDay(goal.createdAt.slice(0, 10), { month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
      </ScrollView>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 6 }}>
      <Text style={{ color: t.text, fontSize: 20, fontWeight: '700' }}>{value}</Text>
      <Text style={{ color: t.muted, fontSize: 12, textAlign: 'center' }}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, paddingBottom: 48 },
  title: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
  stats: { flexDirection: 'row', gap: 8 },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between' },
  day: { width: '12.5%', aspectRatio: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
});
