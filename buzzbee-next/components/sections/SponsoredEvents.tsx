"use client";

import { useEffect, useState } from "react";
import { useEvents } from "@/features/events/queries";
import { Calendar, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function SponsoredEvents() {
  const { data: allEvents, isLoading } = useEvents();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sponsoredEvents = allEvents
    ? allEvents.filter(
        (e) =>
          e.isSponsored && new Date(e.date).getTime() >= new Date().getTime(),
      )
    : [];

  useEffect(() => {
    if (sponsoredEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsoredEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sponsoredEvents.length]);

  if (isLoading || sponsoredEvents.length === 0) return null;

  const activeEvent = sponsoredEvents[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-bold mb-3">
            <Zap size={16} className="text-amber-600" />
            Top Featured
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            BuzzBee Spotlight
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl text-lg">
            Discover premium, hand-picked experiences you won&apos;t want to
            miss.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl group min-h-[400px] md:min-h-[500px]">
          {/* Background Image / Placeholder */}
          <div className="absolute inset-0 bg-gray-900">
            {activeEvent.image ? (
              <img
                src={activeEvent.image}
                alt={activeEvent.title}
                className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <Calendar size={120} className="text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-900/60 to-transparent"></div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-amber-500 text-white font-bold px-4 py-1.5 rounded-full text-sm">
                  {Number(activeEvent.price) > 0
                    ? `Rs. ${activeEvent.price}`
                    : "Free"}
                </span>
                <span className="flex items-center gap-1.5 text-gray-300 font-semibold text-sm">
                  <Calendar size={16} />
                  {new Date(activeEvent.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5 text-gray-300 font-semibold text-sm">
                  <MapPin size={16} />
                  {activeEvent.location}, {activeEvent.district}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-white mb-4 leading-tight">
                {activeEvent.title}
              </h3>

              <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-8 max-w-2xl font-medium">
                {activeEvent.description ||
                  "Join this amazing event powered by BuzzBee!"}
              </p>

              <Link href={`/events/${activeEvent.id}`}>
                <Button
                  size="md"
                  className="bg-amber-600 hover:bg-amber-500 text-white border-none shadow-lg shadow-amber-900/50"
                >
                  Book Your Ticket
                </Button>
              </Link>
            </div>
          </div>

          {/* Dots Indicator */}
          {sponsoredEvents.length > 1 && (
            <div className="absolute bottom-6 right-8 z-20 flex gap-2">
              {sponsoredEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-amber-500"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
