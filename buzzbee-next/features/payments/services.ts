import { post } from '@/lib/axios';

export interface CreatePaymentIntentPayload {
  eventId: number;
  quantity: number;
}

export interface PaymentIntentSession {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  eventId: number;
  quantity: number;
  totalPrice: number;
}

export const paymentsService = {
  createIntent: (data: CreatePaymentIntentPayload) =>
    post<PaymentIntentSession>('/payments/create-intent', data),
};
