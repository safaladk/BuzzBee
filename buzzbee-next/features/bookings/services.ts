import { get, post } from '@/lib/axios';

export interface BookingPayload {
  eventId: number;
  quantity: number;
  totalPrice: number;
}

export interface BookingResponse {
  id: number;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    image: string;
  };
}

export const bookingService = {
  create: (data: BookingPayload) => post<BookingResponse>('/bookings', data),
  getMyBookings: () => get<BookingResponse[]>('/bookings/my-bookings'),
};
