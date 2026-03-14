import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComplaints, updateComplaintStatus, assignStaff } from '@/services/adminService';

// Keys for caching
export const complaintKeys = {
  all: (hostelId: string) => ['complaints', hostelId] as const,
  lists: (hostelId: string) => [...complaintKeys.all(hostelId), 'list'] as const,
  list: (hostelId: string, search: string, page: number, limit: number, userId?: string) => 
    [...complaintKeys.lists(hostelId), { search, page, limit, userId }] as const,
};

export function useComplaints(hostelId: string | undefined, search: string = '', page: number = 1, limit: number = 10, userId?: string) {
  return useQuery({
    queryKey: complaintKeys.list(hostelId!, search, page, limit, userId),
    queryFn: () => getComplaints(hostelId!, search, page, limit, userId),
    enabled: !!hostelId, // Only fetch if hostelId is available
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ complaintId, status }: { complaintId: string; status: string }) => updateComplaintStatus(complaintId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}

export function useAssignStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ complaintId, staffId }: { complaintId: string; staffId: string }) => assignStaff(complaintId, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}
