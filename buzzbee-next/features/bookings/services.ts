import { get, post, patch } from '@/lib/axios';
import { Booking } from '@/lib/types';

export interface BookingPayload {
  eventId: number;
  quantity: number;
  totalPrice: number;
  paymentIntentId?: string;
  pointsUsed?: number;
}

export const bookingService = {
  create: (data: BookingPayload) => post<Booking>('/bookings', data),
  getMyBookings: () => get<Booking[]>('/bookings/my-bookings'),
  requestRefund: (id: number, reason: string) => 
    patch<Booking>(`/bookings/${id}/request-refund`, { reason }),
  getPendingRefunds: () => 
    get<Booking[]>('/bookings/admin/pending-refunds'),
  processRefund: (id: number, status: 'refunded' | 'refund_rejected') => 
    patch<Booking>(`/bookings/${id}/admin/process-refund`, { status }),
};
