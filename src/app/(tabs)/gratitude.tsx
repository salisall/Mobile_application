import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Input, SectionTitle } from '../../components/ui';
import { dayKey, formatDay } from '../../lib/dates';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme';

export default function GratitudeScreen() {
  const t = useTheme();
  const { state, saveGratitude } = useStore();
  const today = dayKey();
  const existing = state.gratitude.find((e) => e.date === today);
  const [items, setItems] = useState<string[]>(['', '', '']);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) setItems([...existing.items, '', '', ''].slice(0, Math.max(3, existing.items.length)));
    // only load once per day / when switching days
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const past = state.gratitude.filter((e) => e.date !== today);
  const canSave = items.some((i) => i.trim());

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card style={{ gap: 10 }}>
          <Text style={[styles.h, { color: t.text }]}>Today I'm grateful for…</Text>
          {items.map((value, i) => (
            <Input
              key={i}
              value={value}
              placeholder={['My health', 'A kind message', 'This cup of coffee'][i] ?? 'Something else'}
              onChangeText={(text) => {
                setSaved(false);
                setItems((prev) => prev.map((p, j) => (j === i ? text : p)));
              }}
            />
          ))}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="+ Add another" variant="soft" style={{ flex: 1 }} onPress={() => setItems((p) => [...p, ''])} />
            <Button
              title={saved ? 'Saved ✓' : 'Save'}
              style={{ flex: 1 }}
              disabled={!canSave}
              onPress={() => {
                saveGratitude(today, items);
                setSaved(true);
              }}
            />
          </View>
        </Card>

        {past.length > 0 && <SectionTitle>Past entries</SectionTitle>}
        {past.map((entry) => (
          <Card key={entry.date} style={{ gap: 6 }}>
            <Text style={{ color: t.muted, fontWeight: '600' }}>
              {formatDay(entry.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
            {entry.items.map((item, i) => (
              <Text key={i} style={{ color: t.text, fontSize: 15 }}>
                🙏 {item}
              </Text>
            ))}
          </Card>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, paddingBottom: 40 },
  h: { fontSize: 18, fontWeight: '700' },
});
