export type BonusType = 'XP_BOOST' | 'HEALTH' | 'StreakFreeze';

export interface Bonus {
  id: string;
  name: string;
  description: string;
  cost: number;
  reward: number;
  type: BonusType;
  duration: number;
}
