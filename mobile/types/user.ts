export interface UserData {
  id: string;
  username: string;
  level: number;
  health: number;
  maxHealth: number;
  currentXP: number;
  xpGoal: number;
  xpFactor: number;
  xpBonusActive: boolean;
  xpFactorUntil: string | null;
  coins: number;
  streak: number;
  taskLimit: number;
  currentTasks: number;
  avatars: string[];
}
