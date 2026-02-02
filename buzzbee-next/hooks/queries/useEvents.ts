import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/lib/services/events';
import { useRouter } from 'next/navigation';
import type { Event } from '@/lib/types';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAll,
  });
};

export const useEvent = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventService.getById(id),
    enabled: !!id,
    initialData: () => {
      const events = queryClient.getQueryData<Event[]>(['events']);
      return events?.find((event) => String(event.id) === String(id));
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: eventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      router.push('/organizer/dashboard');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Failed to create event:', error);
    },
  });
};
