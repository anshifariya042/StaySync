import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRooms, addRoom, updateRoom, deleteRoom } from '@/services/adminService';

// Keys for caching
export const roomKeys = {
  all: (hostelId: string) => ['rooms', hostelId] as const,
  lists: (hostelId: string) => [...roomKeys.all(hostelId), 'list'] as const,
  list: (hostelId: string, search: string) => [...roomKeys.lists(hostelId), { search }] as const,
};

export function useRooms(hostelId: string | undefined, search: string = '') {
  return useQuery({
    queryKey: roomKeys.list(hostelId!, search),
    queryFn: () => getRooms(hostelId!, search),
    enabled: !!hostelId, // Only fetch if hostelId is available
  });
}

export function useAddRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRoom,
    onSuccess: (_, variables) => {
      // Invalidate all room lists for the hostel
      if (variables.hostelId) {
        queryClient.invalidateQueries({ queryKey: roomKeys.all(variables.hostelId) });
      }
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, roomData }: { roomId: string; roomData: any }) => updateRoom(roomId, roomData),
    onSuccess: (_, variables) => {
      // Invalidate all room lists for the hostel
      if (variables.roomData.hostelId) {
        queryClient.invalidateQueries({ queryKey: roomKeys.all(variables.roomData.hostelId) });
      }
      // Alternatively, we could invalidate globally if we don't have hostelId handy
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}
