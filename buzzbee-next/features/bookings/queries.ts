import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService, BookingPayload } from './services';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingPayload) => bookingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getMyBookings,
  });
};

export const useRequestRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => 
      bookingService.requestRefund(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const usePendingRefunds = () => {
  return useQuery({
    queryKey: ['admin', 'refunds'],
    queryFn: bookingService.getPendingRefunds,
  });
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'refunded' | 'refund_rejected' }) => 
      bookingService.processRefund(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'refunds'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const usePreviewRefund = (id: number | null) => {
  return useQuery({
    queryKey: ['bookings', 'preview', id],
    queryFn: () => bookingService.previewRefund(id!),
    enabled: !!id,
  });
};
