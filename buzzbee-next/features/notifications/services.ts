import { get, post } from '@/lib/axios';
import { Notification } from '@/lib/types';

export const notificationsService = {
  getAll: () => get<Notification[]>('/notifications'),
  
  markRead: (id: number) => post<Notification>(`/notifications/${id}/read`),
  
  markAllRead: () => post<{ success: boolean }>('/notifications/read-all'),
};
