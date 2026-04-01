import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/user/profile');
      return res.data;
    },
    // Only fetch if we have a token
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    // Only refetch occasionally to keep cached profile hot
    staleTime: 5 * 60 * 1000,
  });
}
