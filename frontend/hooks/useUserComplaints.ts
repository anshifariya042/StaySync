import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useSubmitComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/hostels/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate complaints for the admin side if they are on the same query client
      // or invalidate user's own complaints if we had a query for them
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}
