import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from './services';

export const usePendingEvents = () => {
  return useQuery({
    queryKey: ['admin', 'pending-events'],
    queryFn: adminService.getPendingEvents,
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminService.getAllUsers,
  });
};

export const useVerifyEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: number; status: 'APPROVED' | 'REJECTED'; note?: string }) =>
      adminService.verifyEvent(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-events'] });
    },
  });
};

export const usePendingOrganizers = () => {
  return useQuery({
    queryKey: ['admin', 'pending-organizers'],
    queryFn: adminService.getPendingOrganizers,
  });
};

export const useVerifyOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verify }: { id: number; verify: boolean }) =>
      adminService.verifyOrganizer(id, verify),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-organizers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const usePendingSponsorships = () => {
  return useQuery({
    queryKey: ['admin', 'pending-sponsorships'],
    queryFn: adminService.getPendingSponsorships,
  });
};

export const useUpdateSponsorshipStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'APPROVED' | 'REJECTED' }) =>
      adminService.updateSponsorshipStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-sponsorships'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
