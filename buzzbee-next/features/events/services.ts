import { get, post, put, del } from '@/lib/axios';
import { Event, CreateEventPayload } from '@/lib/types';

export const eventService = {
  getAll: () => get<Event[]>('/events'),
  
  getById: (id: string) => get<Event>(`/events/${id}`),
  
  create: (data: CreateEventPayload) => post<Event>('/events', data),

  update: (id: string | number, data: CreateEventPayload) => put<Event>(`/events/${id}`, data),

  remove: (id: string | number) => del<{ success: boolean }>(`/events/${id}`),
};
