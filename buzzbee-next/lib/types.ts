export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  district: string;
  price: number;
  category: string;
  image: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REPORTED';
  rejectionNote?: string;
  organizer?: User;
  isPublished?: boolean;
  attendees?: number;
  verified?: boolean;
  rating?: number;
  isFree?: boolean;
  capacity?: number;
  serviceFee?: number;
  revenue?: number;
  maxTicketsPerUser?: number;
  highlights?: string;
  isSponsored?: boolean;
  sponsorshipStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  ticketTiers?: TicketTier[];
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'attendee' | 'organizer' | 'admin';
  isVerified?: boolean;
  verificationDocs?: string[];
  interestedCategories?: string[];
  interestedLocations?: string[];
  createdAt?: string;
}

export interface Category {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface TicketTier {
  name: string;
  price: number;
  capacity: number;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  district: string;
  category: string;
  price: number;
  image?: string;
  capacity?: number;
  serviceFee?: number;
  maxTicketsPerUser?: number;
  highlights?: string;
  isPublished?: boolean;
  ticketTiers?: TicketTier[];
}

export interface PlatformStats {
  eventsCount: number;
  usersCount: number;
  organizersCount: number;
  citiesCount: number;
  totalRevenue: number;
}

export interface Booking {
  id: number;
  user: User;
  event: Event;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'refund_pending' | 'refunded' | 'refund_rejected';
  refundReason?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}
