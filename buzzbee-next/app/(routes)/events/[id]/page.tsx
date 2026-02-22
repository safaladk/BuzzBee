"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useMemo } from "react";
import { Calendar, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { useEvent } from "@/hooks/queries/useEvents";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TicketPurchaseCard } from "@/components/ui/TicketPurchaseCard";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: event, isLoading, error } = useEvent(id);

  // All hooks must be called before any conditional returns
  const capacity = event?.capacity ?? 500;
  const sold = event?.attendees ?? 0;
  const left = Math.max(capacity - sold, 0);
  const price = event
    ? typeof event.price === "string"
      ? parseFloat(event.price)
      : (event.price ?? 0)
    : 0;
  const isFree = price === 0;

  const dateStr = useMemo(() => {
    if (!event) return "";
    return new Date(event.date).toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [event]);

  // Conditional returns AFTER all hooks
  if (isLoading && !event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error && !event) {
    const status = (error as { status?: number })?.status;
    if (status === 404) return notFound();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load event
          </h2>
          <p className="text-gray-600 mb-4">
            Please ensure the backend is running and try again.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-brand-coral font-semibold hover:text-brand-navy transition-colors"
          >
            ← Back to all events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) return notFound();

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
          {isFree && (
            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-blue-500 shadow-md">
              Free Event
            </span>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {event.title}
        </h1>

        {event.image && (
          <div className="mb-6 rounded-2xl overflow-hidden shadow-md">
            <img
              src={event.image}
              alt={event.title}
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
          <span className="inline-flex items-center gap-2">
            <Calendar size={20} className="text-brand-coral" />
            <span className="font-medium">
              {dateStr} • {event.time}
            </span>
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={20} className="text-brand-coral" />
            <span className="font-medium">{event.location}</span>
          </span>
        </div>

        {/* Tickets Progress Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 max-w-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Ticket Availability
          </h3>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description ||
                  `Enjoy community, culture, and creativity at ${event.title}.`}
                {event.organizer ? ` Organized by ${event.organizer}.` : ""}
              </p>
            </div>

            {/* Highlights (Mocked for now as backend doesn't support yet) */}
            <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Event Highlights
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {(event.highlights
                  ? event.highlights.split(",").map((h) => h.trim())
                  : ["Live Music", "Food Stalls", "Cultural Dance"]
                ).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2
                      className="text-green-500 mt-0.5 shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Details */}
            <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Event Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">District</span>
                  <span className="font-semibold text-gray-900">
                    {event.district}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Category</span>
                  <span className="font-semibold text-gray-900">
                    {event.category}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Organizer</span>
                  <span className="font-semibold text-gray-900">
                    {event.organizer || "BuzzBee Host"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Attendees</span>
                  <span className="font-semibold text-gray-900">
                    {event.attendees || 0} registered
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar purchase card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TicketPurchaseCard
                price={price}
                currency={isFree ? "Free" : "Rs."}
                serviceFee={isFree ? 0 : Number(event.serviceFee || 0)}
                onBook={() => router.push(`/events/${event.id}/booking`)}
                paymentOptions={["eSewa", "Khalti"]}
                stats={[
                  `${event.attendees || 0} people already registered`,
                  "Instant confirmation",
                  "Cancellation available 24h before",
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
