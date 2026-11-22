import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { useTheme } from '../lib/theme';

export function tap() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={[styles.section, { color: t.muted }]}>{children}</Text>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'soft' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const bg = variant === 'primary' ? t.primary : variant === 'soft' ? t.primarySoft : 'transparent';
  const fg = variant === 'primary' ? t.onPrimary : variant === 'soft' ? t.primary : t.danger;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        variant === 'danger' && { borderWidth: 1, borderColor: t.danger },
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  const t = useTheme();
  return (
    <TextInput
      placeholderTextColor={t.muted}
      {...props}
      style={[
        styles.input,
        { color: t.text, backgroundColor: t.card, borderColor: t.border },
        props.multiline && { minHeight: 80, textAlignVertical: 'top' },
        props.style,
      ]}
    />
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        tap();
        onPress();
      }}
      style={[
        styles.chip,
        { borderColor: selected ? t.primary : t.border, backgroundColor: selected ? t.primarySoft : t.card },
      ]}
    >
      <Text style={{ color: selected ? t.primary : t.text, fontWeight: selected ? '600' : '400' }}>{label}</Text>
    </Pressable>
  );
}

export function Empty({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  const t = useTheme();
  return (
    <View style={styles.empty}>
      <Text style={{ fontSize: 44 }}>{emoji}</Text>
      <Text style={[styles.emptyTitle, { color: t.text }]}>{title}</Text>
      <Text style={{ color: t.muted, textAlign: 'center', lineHeight: 20 }}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  section: { fontSize: 13, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 8, marginBottom: 8 },
  button: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 48, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
});
