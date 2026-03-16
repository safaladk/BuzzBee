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
  organizer?: string;
  verified?: boolean;
  attendees?: number;
  rating?: number;
  isFree?: boolean;
  capacity?: number;
  serviceFee?: number;
  revenue?: number;
  maxTicketsPerUser?: number;
  highlights?: string;
}

export interface User {
  fullName: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
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
}
