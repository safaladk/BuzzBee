"use client";

import { use, useState } from 'react';
import Link from 'next/link';
import { sampleEvents } from '@/lib/constants';
import type { Event } from '@/lib/types';
import { TicketPurchaseCard } from '@/components/ui/TicketPurchaseCard';
import { CheckCircle2 } from 'lucide-react';

type Props = { params: Promise<{ id: string }> };

export default function EventBookingPage({ params }: Props) {
  const { id } = use(params);
  const event = sampleEvents.find((e) => e.id === id) as Event | undefined;
  const [confirmed, setConfirmed] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  function handleBook() {
    // simulate booking
    setConfirmed(true);
    setTimeout(() => {
      // keep confirmation visible but you could redirect or call API here
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Book: {event.title}</h1>
          <p className="text-gray-600 mt-1">{event.location} • {new Date(event.date).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-md" />
              <h2 className="text-xl font-semibold mt-4">About</h2>
              <p className="text-gray-700 mt-2">Organized by {event.organizer}. {event.isFree ? 'This is a free event.' : `Price: Rs. ${event.price}`}</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-lg font-bold">Payment</h2>
              <p className="text-gray-600 mt-2">Currently simulated — select quantity and press Book Now to confirm.</p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <TicketPurchaseCard
                price={event.price ?? 0}
                currency={event.isFree ? 'Free' : 'Rs.'}
                serviceFee={event.isFree ? 0 : 25}
                paymentOptions={["eSewa", "Khalti", "Card"]}
                stats={["Secure checkout", "Instant confirmation"]}
                onBook={handleBook}
              />

              {confirmed && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-100 p-4 text-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <div>
                      <p className="font-semibold">Booking Confirmed</p>
                      <p className="text-sm text-green-700">A confirmation has been sent to your email.</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/events/${event.id}`} className="text-sm font-medium text-brand-coral">View event</Link>
                    <Link href="/ticketing" className="ml-auto text-sm font-medium text-brand-navy">My Tickets</Link>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
