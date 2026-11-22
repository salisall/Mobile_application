import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GoalRow } from '../../components/GoalRow';
import { Button, Card, Empty, SectionTitle } from '../../components/ui';
import { affirmationForDay } from '../../lib/affirmations';
import { dayKey, formatDay, greeting } from '../../lib/dates';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme';

export default function TodayScreen() {
  const t = useTheme();
  const { state } = useStore();
  const today = dayKey();
  const active = state.goals.filter((g) => !g.manifestedAt);
  const doneCount = active.filter((g) => g.checkIns.includes(today)).length;
  const gratitudeToday = state.gratitude.find((e) => e.date === today);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.date, { color: t.muted }]}>
        {formatDay(today, { weekday: 'long', month: 'long', day: 'numeric' })}
      </Text>
      <Text style={[styles.hello, { color: t.text }]}>{greeting()} ✨</Text>

      <Card style={{ backgroundColor: t.primary, borderColor: t.primary }}>
        <Text style={[styles.affLabel, { color: t.onPrimary }]}>Today's affirmation</Text>
        <Text style={[styles.aff, { color: t.onPrimary }]}>“{affirmationForDay(today)}”</Text>
      </Card>

      <View style={styles.sectionRow}>
        <SectionTitle>Daily check-in</SectionTitle>
        {active.length > 0 && (
          <Text style={{ color: t.muted, fontSize: 13 }}>
            {doneCount}/{active.length} done
          </Text>
        )}
      </View>
      {active.length === 0 ? (
        <Card>
          <Empty emoji="🌙" title="Set your first intention" body="What would you love to bring into your life? Write it down and check in daily." />
          <Button title="Add intention" onPress={() => router.push('/goal/new')} />
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          <Text style={{ color: t.muted, fontSize: 14 }}>
            Take a moment to visualize each one as already real, then tap the circle.
          </Text>
          {active.map((g) => (
            <GoalRow key={g.id} goal={g} />
          ))}
        </View>
      )}

      <SectionTitle>Gratitude</SectionTitle>
      <Card>
        {gratitudeToday ? (
          <View style={{ gap: 6 }}>
            {gratitudeToday.items.map((item, i) => (
              <Text key={i} style={{ color: t.text, fontSize: 15 }}>
                🙏 {item}
              </Text>
            ))}
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            <Text style={{ color: t.muted }}>Gratitude raises your vibration. What are you thankful for today?</Text>
            <Button title="Write 3 things" variant="soft" onPress={() => router.push('/gratitude')} />
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, paddingBottom: 40 },
  date: { fontSize: 14 },
  hello: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  affLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, opacity: 0.85 },
  aff: { fontSize: 20, fontWeight: '600', lineHeight: 28, marginTop: 8 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
