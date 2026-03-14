import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaff, addStaff, updateStaff, deleteStaff } from '@/services/adminService';

// Keys for caching
export const staffKeys = {
  all: (hostelId: string) => ['staff', hostelId] as const,
  lists: (hostelId: string) => [...staffKeys.all(hostelId), 'list'] as const,
  list: (hostelId: string, search: string) => [...staffKeys.lists(hostelId), { search }] as const,
};

export function useStaff(hostelId: string | undefined, search: string = '') {
  return useQuery({
    queryKey: staffKeys.list(hostelId!, search),
    queryFn: () => getStaff(hostelId!, search),
    enabled: !!hostelId, // Only fetch if hostelId is available
  });
}

export function useAddStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStaff,
    onSuccess: (_, variables) => {
      // Invalidate all staff lists for the hostel
      if (variables.hostelId) {
        queryClient.invalidateQueries({ queryKey: staffKeys.all(variables.hostelId) });
      }
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, staffData }: { staffId: string; staffData: any }) => updateStaff(staffId, staffData),
    onSuccess: (_, variables) => {
      // Invalidate all staff lists for the hostel
      if (variables.staffData.hostelId) {
        queryClient.invalidateQueries({ queryKey: staffKeys.all(variables.staffData.hostelId) });
      } else {
        queryClient.invalidateQueries({ queryKey: ['staff'] });
      }
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
