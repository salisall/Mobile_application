import { router, useLocalSearchParams } from 'expo-router';
import { GoalForm } from '../../../components/GoalForm';
import { Empty } from '../../../components/ui';
import { useStore } from '../../../lib/store';

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, updateGoal } = useStore();
  const goal = state.goals.find((g) => g.id === id);
  if (!goal) return <Empty emoji="🔍" title="Not found" body="This intention no longer exists." />;
  return (
    <GoalForm
      initial={goal}
      submitLabel="Save changes"
      onSubmit={(patch) => {
        updateGoal(goal.id, patch);
        router.back();
      }}
    />
  );
}
