import { get, post } from '@/lib/axios';
import { Event, CreateEventPayload } from '@/lib/types';

export const eventService = {
  getAll: () => get<Event[]>('/events'),
  
  getById: (id: string) => get<Event>(`/events/${id}`),
  
  create: (data: CreateEventPayload) => post<Event>('/events', data),
};
