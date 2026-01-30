'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { EventCard } from '@/components/ui/EventCard';
import { sampleEvents } from '@/lib/constants';
import type { Event } from '@/lib/types';

function daysBetween(a: Date, b: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  // Normalize to midnight to avoid DST/timezone noise
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((db - da) / msPerDay);
}

function parseISO(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export interface EventsAroundDateProps {
  date?: Date; 
  windowDays?: number; 
}

export const EventsAroundDate = ({ date = new Date(), windowDays = 3 }: EventsAroundDateProps) => {
  const center = date;
  const eventsAround: Event[] = sampleEvents
    .filter((e) => {
      const evDate = parseISO(e.date);
      const diff = Math.abs(daysBetween(center, evDate));
      return diff <= windowDays;
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const titleDate = center.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-brand-navy bg-brand-peach/30">
              <Calendar size={16} /> Around {titleDate}
            </div>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Happening This Week</h2>
                    {/* <p className="text-gray-600 mt-1">Events within */}
                      {/* <span className="font-semibold text-brand-coral"> ±{windowDays} days</span> of {titleDate} */}
            {/* </p> */}
          </div>
          <Link href="/events" className="text-brand-coral font-semibold hover:opacity-80">View all</Link>
        </div>

        {eventsAround.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsAround.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events around this date</h3>
            <p className="text-gray-600">Try expanding the range or browse all events</p>
            <div className="mt-6">
              <Link href="/events" className="inline-block px-5 py-3 rounded-lg bg-brand-coral text-white font-semibold hover:opacity-90">Browse Events</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
