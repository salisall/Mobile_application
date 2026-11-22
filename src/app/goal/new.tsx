import { router } from 'expo-router';
import { GoalForm } from '../../components/GoalForm';
import { useStore } from '../../lib/store';

export default function NewGoalScreen() {
  const { addGoal } = useStore();
  return (
    <GoalForm
      submitLabel="Set intention ✨"
      onSubmit={(g) => {
        addGoal(g);
        router.back();
      }}
    />
  );
}
