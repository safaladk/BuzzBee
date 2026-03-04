"use client";

import { useMyBookings } from "@/features/bookings/queries";
import { Ticket, Calendar, MapPin, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TicketingPage() {
  const { data: bookings, isLoading, error } = useMyBookings();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = bookings?.filter((b) =>
    b.event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-brand-coral animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Retrieving your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-red-100">
          <p className="text-red-600 font-bold text-lg mb-2">
            Error Loading Tickets
          </p>
          <p className="text-gray-600">
            Please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              My Tickets
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your event bookings and access digital tickets.
            </p>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-coral w-full md:w-64 shadow-sm text-black"
            />
          </div>
        </div>

        {!filteredBookings || filteredBookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-brand-peach/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket size={40} className="text-brand-coral" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No tickets found
            </h3>
            <p className="text-gray-600 mb-8 max-w-xs mx-auto">
              You haven&apos;t booked any events yet. Explore events and start
              your journey!
            </p>
            <Link
              href="/events"
              className="bg-brand-coral text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-opacity-90 transition-all hover:scale-105 active:scale-95 inline-block"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col sm:flex-row transition-all hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="sm:w-40 h-48 sm:h-auto relative overflow-hidden">
                  <img
                    src={booking.event.image}
                    alt={booking.event.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                  <div className="absolute bottom-3 left-3 sm:hidden text-white font-bold px-2 py-0.5 rounded bg-brand-coral text-xs">
                    {booking.quantity}x Tickets
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-brand-coral uppercase tracking-wider">
                      {booking.status === "confirmed"
                        ? "Confirmed"
                        : booking.status}
                    </span>
                    <span className="hidden sm:block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                      ID: #{booking.id.toString().padStart(4, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-3 group-hover:text-brand-coral transition-colors">
                    {booking.event.title}
                  </h3>
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar
                        size={14}
                        className="mr-2 text-brand-coral shrink-0"
                      />
                      <span>
                        {new Date(booking.event.date).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin
                        size={14}
                        className="mr-2 text-brand-coral shrink-0"
                      />
                      <span className="line-clamp-1">
                        {booking.event.location}
                      </span>
                    </div>
                    <div className="flex items-center text-brand-navy text-sm font-bold">
                      <Ticket size={14} className="mr-2 shrink-0" />
                      <span>
                        {booking.quantity} Ticket
                        {booking.quantity > 1 ? "s" : ""} • Rs.{" "}
                        {booking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <Link
                      href={`/events/${booking.event.id}`}
                      className="text-xs font-bold text-gray-400 hover:text-brand-coral transition-colors uppercase tracking-widest"
                    >
                      View Event
                    </Link>
                    <button className="bg-brand-coral/10 text-brand-coral px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-coral hover:text-white transition-all">
                      Download Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
