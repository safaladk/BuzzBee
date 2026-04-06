import { useMutation } from '@tanstack/react-query';
<<<<<<< Updated upstream
import { CreatePaymentIntentPayload, paymentsService } from './services';
=======
import {
  CreatePaymentIntentPayload,
  CreateSponsorshipIntentPayload,
  paymentsService,
} from './services';
>>>>>>> Stashed changes

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentIntentPayload) =>
      paymentsService.createIntent(data),
  });
};
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
