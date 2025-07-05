import { UserData } from '@/types/user';
import api from '@/services/api';

export async function fetchUserData(): Promise<UserData> {
  const response = await api.get<UserData>('/user/profile');
  return response.data;
}

export async function selectLevelUpBonus(
  userId: String,
  choice: 'HEALTH' | 'TASK_LIMIT',
) {
  const userID = userId;
  const response = await api.post('/user/levelup', {
    userId,
    choice,
  });

  return response.data;
}
