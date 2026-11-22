import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, SectionTitle } from '../../components/ui';
import { dayKey, formatDay, lastNDays, longestStreak } from '../../lib/dates';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme';
import { CATEGORIES } from '../../lib/types';

export default function ProgressScreen() {
  const t = useTheme();
  const { state } = useStore();
  const goals = state.goals;
  const manifested = goals.filter((g) => g.manifestedAt);
  const allCheckIns = goals.flatMap((g) => g.checkIns);
  const activeDays = new Set(allCheckIns);
  const best = Math.max(0, ...goals.map((g) => longestStreak(g.checkIns)));
  const anyDayStreak = longestStreak([...activeDays]);

  const week = lastNDays(7);
  const counts = week.map((d) => goals.filter((g) => g.checkIns.includes(d)).length);
  const maxCount = Math.max(1, ...counts);
  const today = dayKey();

  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    total: goals.filter((g) => g.category === c.key).length,
    done: goals.filter((g) => g.category === c.key && g.manifestedAt).length,
  })).filter((c) => c.total > 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        <Stat label="Intentions" value={goals.length} />
        <Stat label="Manifested" value={manifested.length} accent />
        <Stat label="Total check-ins" value={allCheckIns.length} />
        <Stat label="Best streak" value={best} suffix="d" />
      </View>

      <SectionTitle>Last 7 days</SectionTitle>
      <Card>
        <View style={styles.chart}>
          {week.map((d, i) => (
            <View key={d} style={styles.barCol}>
              <Text style={{ color: t.muted, fontSize: 12 }}>{counts[i] || ''}</Text>
              <View style={[styles.barTrack, { backgroundColor: t.primarySoft }]}>
                <View style={{ height: `${(counts[i] / maxCount) * 100}%`, backgroundColor: t.primary, borderRadius: 6 }} />
              </View>
              <Text style={{ color: d === today ? t.primary : t.muted, fontSize: 12, fontWeight: d === today ? '700' : '400' }}>
                {formatDay(d, { weekday: 'narrow' })}
              </Text>
            </View>
          ))}
        </View>
        <Text style={{ color: t.muted, marginTop: 12, fontSize: 13 }}>
          Check-ins per day · longest run of practice days: {anyDayStreak}
        </Text>
      </Card>

      {byCategory.length > 0 && <SectionTitle>By area of life</SectionTitle>}
      {byCategory.length > 0 && (
        <Card style={{ gap: 12 }}>
          {byCategory.map((c) => (
            <View key={c.key} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: t.text, fontWeight: '600' }}>
                  {c.emoji} {c.label}
                </Text>
                <Text style={{ color: t.muted }}>
                  {c.done}/{c.total}
                </Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: t.primarySoft }]}>
                <View style={{ width: `${(c.done / c.total) * 100}%`, height: '100%', backgroundColor: t.gold, borderRadius: 4 }} />
              </View>
            </View>
          ))}
        </Card>
      )}

      {manifested.length > 0 && <SectionTitle>Manifested 🌟</SectionTitle>}
      {manifested.map((g) => (
        <Card key={g.id} style={{ backgroundColor: t.goldSoft, borderColor: t.gold }}>
          <Text style={{ color: t.text, fontWeight: '600', fontSize: 16 }}>{g.title}</Text>
          <Text style={{ color: t.muted, marginTop: 4 }}>
            {new Date(g.manifestedAt!).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} · {g.checkIns.length} check-ins
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

function Stat({ label, value, suffix, accent }: { label: string; value: number; suffix?: string; accent?: boolean }) {
  const t = useTheme();
  return (
    <Card style={[styles.stat, accent && { backgroundColor: t.goldSoft, borderColor: t.gold }]}>
      <Text style={{ color: t.text, fontSize: 28, fontWeight: '700' }}>
        {value}
        {suffix ? <Text style={{ fontSize: 16, color: t.muted }}>{suffix}</Text> : null}
      </Text>
      <Text style={{ color: t.muted, fontSize: 13 }}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexGrow: 1, flexBasis: '45%', gap: 2 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', height: 140, gap: 6 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barTrack: { flex: 1, width: '70%', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
});
