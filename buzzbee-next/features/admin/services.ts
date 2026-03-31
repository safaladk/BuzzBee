import { get, post, put } from '@/lib/axios';
import { Event, User } from '@/lib/types';

export const adminService = {
  getPendingEvents: () => get<Event[]>('/admin/events/pending'),
  getAllUsers: () => get<User[]>('/admin/users'),
  verifyEvent: (id: number, status: 'APPROVED' | 'REJECTED', note?: string) => 
    post(`/admin/events/${id}/verify`, { status, note }),
  updateUserRole: (id: number, role: string) => 
    put(`/admin/users/${id}/role`, { role }),
  getPendingOrganizers: () => get<User[]>('/admin/users/pending-verification'),
  verifyOrganizer: (id: number, verify: boolean) => 
    post(`/admin/users/${id}/verify`, { verify }),
  getPendingSponsorships: () => get<Event[]>('/events/admin/pending-sponsorships'),
  updateSponsorshipStatus: (id: number, status: 'APPROVED' | 'REJECTED') => 
    put(`/events/admin/${id}/sponsor-status`, { status }),
};
