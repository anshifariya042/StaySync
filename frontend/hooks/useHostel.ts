import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useFeaturedHostels(limit: number = 3) {
  return useQuery({
    queryKey: ['hostels', 'featured', limit],
    queryFn: async () => {
      const response = await api.get(`/hostels?limit=${limit}`);
      return response.data.hostels || [];
    },
  });
}
