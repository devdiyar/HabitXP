import { useQuery } from '@tanstack/react-query';
import { fetchUserData } from '@/services/userService';
import { UserData } from '@/types/user';
import { useAuth } from '@/context/AuthContext';

export function useUserData() {
  const { userId } = useAuth();

  return useQuery<UserData>({
    queryKey: ['userData', userId],
    queryFn: fetchUserData,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 Minuten Cache
    refetchOnWindowFocus: true,
  });
}
