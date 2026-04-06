import { Calendar, MapPin, Music, Palette, Utensils, Trophy, Filter, TrendingUp } from 'lucide-react';
import { Category, Event, Stat } from './types';

export const categories: Category[] = [
  { name: 'All', icon: Filter, color: 'bg-purple-500' },
  { name: 'Music', icon: Music, color: 'bg-pink-500' },
  { name: 'Art', icon: Palette, color: 'bg-blue-500' },
  { name: 'Food', icon: Utensils, color: 'bg-orange-500' },
  { name: 'Sports', icon: Trophy, color: 'bg-green-500' },
  { name: 'Technology', icon: TrendingUp, color: 'bg-indigo-500' }
];

export const stats: Stat[] = [
  { label: 'Events Listed', value: '2,500+', icon: Calendar },
  { label: 'Happy Users', value: '50,000+', icon: MapPin },
  { label: 'Verified Organizers', value: '850+', icon: Trophy },
  { label: 'Cities Covered', value: '25+', icon: MapPin }
];

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Kathmandu Jazz Festival 2025',
    date: '2025-12-28',
    time: '18:00',
    location: 'Thamel, Kathmandu',
    district: 'Kathmandu',
    price: 500,
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Jazz Nepal',
    verified: true,
    attendees: 234,
    rating: 4.8,
    isFree: true
  },
  {
    id: '2',
    title: 'Community Art Workshop',
    date: '2025-12-22',
    time: '10:00',
    location: 'Patan Durbar Square',
    district: 'Lalitpur',
    price: 0,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Local Artists Collective',
    verified: true,
    attendees: 45,
    rating: 4.6,
    isFree: true
  },
  {
    id: '3',
    title: 'Food Festival Pokhara',
    date: '2025-12-25',
    time: '12:00',
    location: 'Lakeside, Pokhara',
    district: 'Kaski',
    price: 300,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Pokhara Food Culture',
    verified: true,
    attendees: 156,
    rating: 4.9,
    isFree: false
  },
  {
    id: '4',
    title: 'Tech Startup Meetup',
    date: '2025-12-23',
    time: '16:00',
    location: 'Durbar Marg, Kathmandu',
    district: 'Kathmandu',
    price: 0,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1529333166433-5eebc6b14ebf?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Nepal Tech Hub',
    verified: true,
    attendees: 89,
    rating: 4.7,
    isFree: true
  },
  {
    id: '5',
    title: 'Marathon for Change',
    date: '2025-12-30',
    time: '06:00',
    location: 'Bhaktapur',
    district: 'Bhaktapur',
    price: 200,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1508606572321-901ea443707f?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Run Nepal',
    verified: true,
    attendees: 312,
    rating: 4.5,
    isFree: false
  },
  {
    id: '6',
    title: 'Yoga in the Park',
    date: '2025-12-24',
    time: '07:00',
    location: 'Garden of Dreams',
    district: 'Kathmandu',
    price: 0,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Wellness Nepal',
    verified: false,
    attendees: 67,
    rating: 4.4,
    isFree: true
  }
];
