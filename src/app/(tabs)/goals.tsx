import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { GoalRow } from '../../components/GoalRow';
import { Chip, Empty, tap } from '../../components/ui';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme';

type Filter = 'active' | 'manifested';

export default function GoalsScreen() {
  const t = useTheme();
  const { state } = useStore();
  const [filter, setFilter] = useState<Filter>('active');
  const goals = state.goals.filter((g) => (filter === 'active' ? !g.manifestedAt : !!g.manifestedAt));
  const manifestedCount = state.goals.filter((g) => g.manifestedAt).length;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filters}>
        <Chip label={`Manifesting (${state.goals.length - manifestedCount})`} selected={filter === 'active'} onPress={() => setFilter('active')} />
        <Chip label={`Manifested (${manifestedCount})`} selected={filter === 'manifested'} onPress={() => setFilter('manifested')} />
      </View>
      <FlatList
        data={goals}
        keyExtractor={(g) => g.id}
        contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 10, paddingBottom: 100 }}
        renderItem={({ item }) => <GoalRow goal={item} />}
        ListEmptyComponent={
          filter === 'active' ? (
            <Empty emoji="🌱" title="No intentions yet" body="Tap + to write down something you're calling in." />
          ) : (
            <Empty emoji="🌟" title="Nothing marked yet" body="When an intention comes true, open it and mark it as manifested. It will be celebrated here." />
          )
        }
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add intention"
        onPress={() => {
          tap();
          router.push('/goal/new');
        }}
        style={({ pressed }) => [styles.fab, { backgroundColor: t.primary, opacity: pressed ? 0.85 : 1 }]}
      >
        <Ionicons name="add" size={30} color={t.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
