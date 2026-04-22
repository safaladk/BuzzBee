"use client";

import { useMyBookings, useRequestRefund, usePreviewRefund } from "@/features/bookings/queries";
import {
  Ticket,
  Calendar,
  MapPin,
  Loader2,
  Search,
  RotateCcw,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Booking } from "@/lib/types";

const REFUND_REASONS = [
  "Schedule conflict",
  "Event rescheduled or changed",
  "Booked the wrong event/date",
  "No longer interested",
  "Medical or emergency situation",
  "Other",
];

export default function TicketingPage() {
  const { data: bookings, isLoading, error } = useMyBookings();
  const { mutate: requestRefund, isPending: isRequestingRefund } =
    useRequestRefund();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"upcoming" | "past">("upcoming");

  // Refund Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const { data: previewData, isLoading: isPreviewLoading } = usePreviewRefund(
    selectedBooking?.id ?? null
  );

  const handleRefundRequest = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    setSelectedReason("");
    setCustomReason("");
  };

  const now = useMemo(() => new Date().getTime(), []);

  const confirmRefund = () => {
    if (!selectedBooking || !selectedReason) return;

    const finalReason =
      selectedReason === "Other" ? customReason : selectedReason;
    if (selectedReason === "Other" && !customReason.trim()) {
      alert("Please provide a custom reason.");
      return;
    }

    requestRefund(
      { id: selectedBooking.id, reason: finalReason },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          alert("Refund successful! Points have been added to your wallet.");
        },
      },
    );
  };


  const filteredBookings = bookings?.filter((b) => {
    const matchesSearch = b.event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const eventDate = new Date(b.event.date).getTime();
    const isPast = eventDate < now;
    
    if (filterTab === "upcoming") return matchesSearch && !isPast;
    return matchesSearch && isPast;
  });

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
            <p className="text-gray-600 mt-1 italic font-medium">
              Manage your event bookings and access digital tickets.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
              <button
                onClick={() => setFilterTab("upcoming")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterTab === "upcoming" ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20" : "text-gray-500 hover:text-brand-coral"}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterTab("past")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterTab === "past" ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20" : "text-gray-500 hover:text-brand-coral"}`}
              >
                History
              </button>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-coral w-full md:w-64 shadow-sm text-black transition-all"
              />
            </div>
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent sm:hidden" />
                  <div className="absolute bottom-3 left-3 sm:hidden text-white font-bold px-2 py-0.5 rounded bg-brand-coral text-xs">
                    {booking.quantity}x Tickets
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        booking.status === "confirmed"
                          ? "text-green-600"
                          : booking.status === "refund_pending"
                            ? "text-amber-600"
                            : booking.status === "refunded"
                              ? "text-red-600"
                              : "text-gray-600"
                      }`}
                    >
                      {booking.status === "confirmed"
                        ? "Confirmed"
                        : booking.status === "refund_pending"
                          ? "Refund Pending"
                          : booking.status === "refunded"
                            ? "Refunded"
                            : booking.status === "refund_rejected"
                              ? "Refund Rejected"
                              : booking.status}
                    </span>
                    <span className="hidden sm:block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                      ID: #{booking.id.toString().padStart(4, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-brand-coral transition-colors">
                    {booking.event.title}
                  </h3>
                  {booking.status === "refunded" && booking.refundPolicyApplied && (
                    <p className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md mb-2 w-fit">
                      {booking.refundPolicyApplied} • +{booking.refundAmountPoints} pts
                    </p>
                  )}
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
                  <div className="mt-2 pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                    <Link
                      href={`/events/${booking.event.id}`}
                      className="text-xs font-bold text-gray-400 hover:text-brand-coral transition-colors uppercase tracking-widest whitespace-nowrap"
                    >
                      View Event
                    </Link>
                    <div className="flex gap-2">
                      {booking.status === "confirmed" && filterTab === "upcoming" && (
                        <button
                          onClick={() => handleRefundRequest(booking)}
                          disabled={isRequestingRefund}
                          className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-amber-100 transition-all disabled:opacity-50"
                        >
                          <RotateCcw size={14} />
                          {isRequestingRefund ? "Requesting..." : "Refund"}
                        </button>
                      )}
                      <button className="bg-brand-coral/10 text-brand-coral px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-coral hover:text-white transition-all whitespace-nowrap">
                        Download Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Cancellation"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
              <span>System Approval</span>
              <span className="text-green-600 flex items-center gap-1">
                <Zap size={12} fill="currentColor" /> Instant
              </span>
            </div>
            <div className="p-4 space-y-3">
              {isPreviewLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-brand-coral" size={24} />
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Paid Amount</span>
                    <span className="text-slate-900 font-bold">Rs. {selectedBooking?.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-100 w-full" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">Points to be returned</span>
                    <span className="text-lg font-black text-brand-coral">{previewData?.points.toLocaleString() || 0} BuzzBee Points</span>
                  </div>
                  <p className="text-xs text-brand-coral font-medium bg-brand-coral/5 px-2 py-1 rounded-md text-center">
                    {previewData?.reason}
                  </p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Reason for Cancellation
            </label>
            <div className="space-y-2">
              {REFUND_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedReason === reason
                      ? "border-brand-coral bg-brand-coral/5 text-brand-coral"
                      : "border-gray-100 hover:border-gray-200 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="refundReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 accent-brand-coral"
                  />
                  <span className="text-sm font-medium">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === "Other" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Please specify
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Details of your request..."
                rows={3}
                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-coral/20 transition-all border border-gray-100"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-all"
            >
              Go Back
            </button>
            <button
              onClick={confirmRefund}
              disabled={
                !selectedReason ||
                (selectedReason === "Other" && !customReason.trim()) ||
                isRequestingRefund ||
                isPreviewLoading
              }
              className="flex-2 py-3 rounded-xl bg-brand-coral text-white text-sm font-bold shadow-md shadow-brand-coral/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isRequestingRefund ? "Processing..." : "Confirm Instant Refund"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
