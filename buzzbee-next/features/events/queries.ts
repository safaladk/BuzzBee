import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from './services';
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
      setTimeout(() => {
        router.push('/organizer/dashboard');
      }, 500);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Failed to create event:', error);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => eventService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', String(variables.id)] });
      setTimeout(() => {
        router.push('/organizer/dashboard');
      }, 500);
    },
    onError: (error: any) => {
      console.error('Failed to update event:', error);
    },
  });
};
