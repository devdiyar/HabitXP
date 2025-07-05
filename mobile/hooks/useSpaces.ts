import { useQuery } from '@tanstack/react-query';
import { getSpaces } from '@/services/spaceService';

export const useSpaces = () => {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: getSpaces,
  });
};
