import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { addDays, dayKey, formatDay } from '../lib/dates';
import type { NewGoal } from '../lib/store';
import { useTheme } from '../lib/theme';
import { CATEGORIES, type Category } from '../lib/types';
import { Button, Chip, Input } from './ui';

const TIMEFRAMES = [
  { label: 'No date', days: null },
  { label: '1 month', days: 30 },
  { label: '3 months', days: 91 },
  { label: '6 months', days: 182 },
  { label: '1 year', days: 365 },
] as const;

export function GoalForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: NewGoal;
  submitLabel: string;
  onSubmit: (g: NewGoal) => void;
}) {
  const t = useTheme();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'growth');
  const [why, setWhy] = useState(initial?.why ?? '');
  const [affirmation, setAffirmation] = useState(initial?.affirmation ?? '');
  const [targetDate, setTargetDate] = useState<string | null>(initial?.targetDate ?? null);
  const [timeframe, setTimeframe] = useState<string>(initial?.targetDate ? 'keep' : 'No date');

  const canSave = title.trim().length > 0;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Field label="I am calling in…" hint="Write it in the present tense, as if it's already yours.">
          <Input value={title} onChangeText={setTitle} placeholder="I live in a bright home by the sea" autoFocus={!initial} />
        </Field>

        <Field label="Area of life">
          <View style={styles.chips}>
            {CATEGORIES.map((c) => (
              <Chip key={c.key} label={`${c.emoji} ${c.label}`} selected={category === c.key} onPress={() => setCategory(c.key)} />
            ))}
          </View>
        </Field>

        <Field label="Why it matters" hint="How will it feel when it's real?">
          <Input value={why} onChangeText={setWhy} placeholder="I feel peaceful, free and safe" multiline />
        </Field>

        <Field label="My affirmation" hint="Optional. Repeat it during your check-in.">
          <Input value={affirmation} onChangeText={setAffirmation} placeholder="I am worthy of my dream home" />
        </Field>

        <Field label="Timeframe">
          <View style={styles.chips}>
            {initial?.targetDate && (
              <Chip
                label={`Keep ${formatDay(initial.targetDate, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                selected={timeframe === 'keep'}
                onPress={() => {
                  setTimeframe('keep');
                  setTargetDate(initial.targetDate);
                }}
              />
            )}
            {TIMEFRAMES.map((tf) => (
              <Chip
                key={tf.label}
                label={tf.label}
                selected={timeframe === tf.label}
                onPress={() => {
                  setTimeframe(tf.label);
                  setTargetDate(tf.days === null ? null : dayKey(addDays(new Date(), tf.days)));
                }}
              />
            ))}
          </View>
          {targetDate && (
            <Text style={{ color: t.muted, marginTop: 6 }}>
              Target: {formatDay(targetDate, { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          )}
        </Field>

        <Button
          title={submitLabel}
          disabled={!canSave}
          onPress={() =>
            onSubmit({ title: title.trim(), category, why: why.trim(), affirmation: affirmation.trim(), targetDate })
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <View>
        <Text style={{ color: t.text, fontSize: 16, fontWeight: '600' }}>{label}</Text>
        {hint && <Text style={{ color: t.muted, fontSize: 13, marginTop: 2 }}>{hint}</Text>}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 22, paddingBottom: 48 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
