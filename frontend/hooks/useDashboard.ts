import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '@/services/adminService';

export const dashboardKeys = {
  all: (hostelId: string) => ['dashboard', hostelId] as const,
  overview: (hostelId: string) => [...dashboardKeys.all(hostelId), 'overview'] as const,
};

export function useDashboardOverview(hostelId: string | undefined) {
  return useQuery({
    queryKey: dashboardKeys.overview(hostelId!),
    queryFn: () => getDashboardOverview(),
    enabled: !!hostelId, // Only fetch if hostelId is available
  });
}
