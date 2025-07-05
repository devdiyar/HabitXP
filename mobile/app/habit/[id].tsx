import { router, useLocalSearchParams } from 'expo-router';
import HabitFormScreen from '@/components/habit/HabitFormScreen';
import { useQuery } from '@tanstack/react-query';
import { getTaskById, updateTask } from '@/services/taskService';
import { NewTask } from '@/types/task';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams();
  const { data: habit, isLoading } = useQuery({
    queryKey: ['habit', id],
    queryFn: () => getTaskById(id as string),
    enabled: !!id,
  });

  if (isLoading || !habit) return null;

  const handleUpdate = async (updatedHabit: NewTask) => {
    await updateTask(habit.id, {
      ...updatedHabit,
      id: habit.id,
    });
    router.replace('/');
  };

  return (
    <HabitFormScreen
      initialValues={habit}
      disabledFields={['title']}
      onSubmit={handleUpdate}
    />
  );
}
