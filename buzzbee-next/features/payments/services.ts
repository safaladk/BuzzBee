import { post } from '@/lib/axios';

export interface CreatePaymentIntentPayload {
  eventId: number;
  quantity: number;
<<<<<<< Updated upstream
=======
  pointsUsed?: number;
>>>>>>> Stashed changes
}

export interface PaymentIntentSession {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  eventId: number;
  quantity: number;
  totalPrice: number;
<<<<<<< Updated upstream
=======
  pointsUsed: number;
}

export interface CreateSponsorshipIntentPayload {
  eventId: number;
  days: number;
}

export interface SponsorshipIntentSession {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  eventId: number;
  days: number;
>>>>>>> Stashed changes
}

export const paymentsService = {
  createIntent: (data: CreatePaymentIntentPayload) =>
    post<PaymentIntentSession>('/payments/create-intent', data),
<<<<<<< Updated upstream
=======

  createSponsorshipIntent: (data: CreateSponsorshipIntentPayload) =>
    post<SponsorshipIntentSession>('/payments/create-sponsorship-intent', data),

  verifySponsorship: (data: { paymentIntentId: string; eventId: number }) =>
    post<{ success: boolean; days: number }>('/payments/verify-sponsorship', data),
>>>>>>> Stashed changes
};
