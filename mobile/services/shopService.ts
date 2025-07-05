import api from '@/services/api';
import { Bonus } from '@/types/bonus';

export async function fetchBonuses(): Promise<Bonus[]> {
  const response = await api.get<Bonus[]>('/bonuses');
  return response.data;
}

export const buyBonus = async (
  bonusId: string,
  userId: string,
): Promise<string> => {
  try {
    const res = await api.post('/shop/buy', {
      userId,
      bonusId,
    });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      throw new Error(err.response.data);
    }
    throw err;
  }
};
