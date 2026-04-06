import { useMutation } from '@tanstack/react-query';
import { CreatePaymentIntentPayload, paymentsService } from './services';

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentIntentPayload) =>
      paymentsService.createIntent(data),
  });
};
