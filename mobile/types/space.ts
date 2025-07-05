import { Colors } from '@/constants/Colors';

export type NewSpace = {
  userId: string;
  name: string;
  colorKey: keyof typeof Colors.habit;
};

export type Space = NewSpace & {
  id: string;
  taskIds: string[];
};
