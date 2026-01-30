 'use client';

import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { use } from 'react';
import { Calendar, MapPin, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { sampleEvents } from '@/lib/constants';
import type { Event } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TicketPurchaseCard } from '@/components/ui/TicketPurchaseCard';

type ExtendedEvent = Event & {
  capacity?: number;
  sold?: number;
  tags?: string[];
  highlights?: string[];
  schedule?: { time: string; title: string }[];
};

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const event = sampleEvents.find((e) => e.id === id) as ExtendedEvent | undefined;
  if (!event) return notFound();

  const capacity = event.capacity ?? 500;
  const sold = event.sold ?? Math.floor(capacity * 0.68);
  const left = Math.max(capacity - sold, 0);
  const price = event.price ?? 0;
  const dateStr = new Date(event.date).toLocaleString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <section className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-brand-coral shadow-md">
            {event.category}
          </span>
          {event.verified && (
            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-green-500 shadow-md">
              <ShieldCheck size={16} /> Verified
            </span>
          )}
          {event.isFree && (
            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-blue-500 shadow-md">
              Free Event
            </span>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{event.title}</h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
          <span className="inline-flex items-center gap-2">
            <Calendar size={20} className="text-brand-coral" /> 
            <span className="font-medium">{dateStr} • {event.time}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={20} className="text-brand-coral" /> 
            <span className="font-medium">{event.location}</span>
          </span>
        </div>

        {/* Tickets Progress Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 max-w-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Ticket Availability</h3>
          <ProgressBar value={sold} total={capacity} />
          <div className="mt-3 flex items-center justify-between text-sm">
            <p className="text-gray-600">
              <span className="font-bold text-brand-coral text-xl">{left}</span>
              <span className="text-gray-500"> tickets remaining</span>
            </p>
            <p className="text-gray-500">
              {sold} / {capacity} sold
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed">
                Enjoy community, culture, and creativity at {event.title}. Organized by {event.organizer}.
              </p>
            </div>

            {/* Highlights */}
            {!!event.highlights?.length && (
              <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Highlights</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {event.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Schedule */}
            {!!event.schedule?.length && (
              <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Schedule</h2>
                <div className="space-y-3">
                  {event.schedule.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 hover:bg-brand-peach/20 transition-colors">
                      <Clock className="text-brand-coral flex-shrink-0" size={20} />
                      <span className="font-semibold text-brand-navy">{s.time}</span>
                      <span className="text-gray-700">— {s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">District</span>
                  <span className="font-semibold text-gray-900">{event.district}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Category</span>
                  <span className="font-semibold text-gray-900">{event.category}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Organizer</span>
                  <span className="font-semibold text-gray-900">{event.organizer}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Attendees</span>
                  <span className="font-semibold text-gray-900">{event.attendees} registered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar purchase card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
                <TicketPurchaseCard
                  price={price}
                  currency={event.isFree ? 'Free' : 'Rs.'}
                  serviceFee={event.isFree ? 0 : 25}
                  onBook={() => router.push(`/events/${event.id}/booking`)}
                  paymentOptions={["eSewa", "Khalti"]}
                  stats={[
                    `${event.attendees} people already registered`,
                    'Instant confirmation',
                    'Cancellation available 24h before',
                  ]}
                />
            </div>
          </div>
        </div>

        {/* Back to events */}
        <div className="mt-12 text-center">
          <Link 
            href="/events" 
            className="inline-flex items-center gap-2 text-brand-coral font-semibold hover:text-brand-navy transition-colors px-6 py-3 rounded-xl hover:bg-white hover:shadow-md"
          >
            ← Back to all events
          </Link>
        </div>
      </div>
    </section>
  );
}
