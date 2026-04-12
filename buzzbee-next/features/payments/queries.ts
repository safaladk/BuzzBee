import { useMutation } from '@tanstack/react-query';
import {
  CreatePaymentIntentPayload,
  CreateSponsorshipIntentPayload,
  paymentsService,
} from './services';

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentIntentPayload) =>
      paymentsService.createIntent(data),
  });
};

export const useCreateSponsorshipIntent = () => {
  return useMutation({
    mutationFn: (data: CreateSponsorshipIntentPayload) =>
      paymentsService.createSponsorshipIntent(data),
  });
};

export const useVerifySponsorship = () => {
  return useMutation({
    mutationFn: (data: { paymentIntentId: string; eventId: number }) =>
      paymentsService.verifySponsorship(data),
  });
};