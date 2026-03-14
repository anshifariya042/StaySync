import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResidents, addResident, deleteResident } from '@/services/adminService';

// Keys for caching
export const residentKeys = {
  all: (hostelId: string) => ['residents', hostelId] as const,
  lists: (hostelId: string) => [...residentKeys.all(hostelId), 'list'] as const,
  list: (hostelId: string, search: string) => [...residentKeys.lists(hostelId), { search }] as const,
};

export function useResidents(hostelId: string | undefined, search: string = '') {
  return useQuery({
    queryKey: residentKeys.list(hostelId!, search),
    queryFn: () => getResidents(hostelId!, search),
    enabled: !!hostelId, // Only fetch if hostelId is available
  });
}

export function useAddResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addResident,
    onSuccess: (_, variables) => {
      // Invalidate all resident lists for the hostel
      if (variables.hostelId) {
        queryClient.invalidateQueries({ queryKey: residentKeys.all(variables.hostelId) });
      }
    },
  });
}

export function useDeleteResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}
