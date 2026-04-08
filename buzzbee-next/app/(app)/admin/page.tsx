"use client";

import React, { useState } from "react";
import { Users, Calendar, ShieldCheck, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { useStats } from "@/features/stats/queries";
import {
  usePendingEvents,
  useVerifyEvent,
  usePendingOrganizers,
  useVerifyOrganizer,
  usePendingSponsorships,
  useUpdateSponsorshipStatus,
} from "@/features/admin/queries";
import {
  usePendingRefunds,
  useProcessRefund,
} from "@/features/bookings/queries";
import { User, Booking, Event as BuzzBeeEvent } from "@/lib/types";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export default function AdminDashboardOverview() {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "info" | "danger" | "warning";
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: (note?: string) => void;
    requiresNote?: boolean;
    notePlaceholder?: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { data: platformStats } = useStats();
  const { data: pendingEvents, isLoading: isLoadingEvents } =
    usePendingEvents();
  const { data: pendingOrganizers, isLoading: isLoadingOrganizers } =
    usePendingOrganizers();
  const { data: pendingRefunds, isLoading: isLoadingRefunds } =
    usePendingRefunds();
  const { data: pendingSponsorships, isLoading: isLoadingSponsorships } =
    usePendingSponsorships();

  const { mutate: verifyEvent } = useVerifyEvent();
  const { mutate: verifyOrganizer } = useVerifyOrganizer();
  const { mutate: processRefund } = useProcessRefund();
  const { mutate: updateSponsorship } = useUpdateSponsorshipStatus();

  const triggerConfirm = (options: Partial<typeof confirmModal>) => {
    setConfirmModal({
      isOpen: true,
      type: "info",
      title: "Are you sure?",
      message: "This action cannot be undone.",
      confirmText: "Confirm",
      onConfirm: () => {},
      ...options,
    });
  };

  const stats = [
    {
      label: "Total Users",
      value: platformStats ? platformStats.usersCount.toLocaleString() : "...",
      icon: <Users size={20} />,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Total Events",
      value: platformStats ? platformStats.eventsCount.toString() : "...",
      icon: <Calendar size={20} />,
      bg: "bg-brand-peach/20",
      color: "text-brand-coral",
    },
    {
      label: "Organizers",
      value: platformStats ? platformStats.organizersCount.toString() : "...",
      icon: <ShieldCheck size={20} />,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
  ];

  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            System Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Welcome back, here is what's happening across BuzzBee today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Event Verification Queue */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
            Event Queue
            {pendingEvents && pendingEvents.length > 0 && (
              <span className="bg-brand-coral text-white text-[10px] px-2 py-0.5 rounded-full">
                {pendingEvents.length}
              </span>
            )}
          </h2>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            {isLoadingEvents ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                Scanning Queue...
              </div>
            ) : !pendingEvents || pendingEvents.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-xl">
                All Clean
              </div>
            ) : (
              pendingEvents.map((event) => (
                <div key={event.id} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden group-hover:ring-2 group-hover:ring-brand-coral transition-all shrink-0">
                        <img
                          src={event.image || "https://via.placeholder.com/150"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                          {event.category} • {event.district}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        triggerConfirm({
                          title: "Approve Event",
                          message: `Are you sure you want to approve "${event.title}"?`,
                          onConfirm: () =>
                            verifyEvent({
                              id: Number(event.id),
                              status: "APPROVED",
                            }),
                        })
                      }
                      className="flex-1 py-2 rounded-lg bg-green-50 text-green-700 text-[10px] font-black uppercase hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        triggerConfirm({
                          title: "Reject Event",
                          message: `Please provide a reason for rejecting "${event.title}".`,
                          type: "danger",
                          requiresNote: true,
                          onConfirm: (note) =>
                            verifyEvent({
                              id: Number(event.id),
                              status: "REJECTED",
                              note,
                            }),
                        })
                      }
                      className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                  <div className="mt-4 h-px bg-slate-100 last:hidden"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Refund Queue Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
            Refund Queue
            {pendingRefunds && pendingRefunds.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {pendingRefunds.length}
              </span>
            )}
          </h2>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            {isLoadingRefunds ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                Scanning Requests...
              </div>
            ) : !pendingRefunds || pendingRefunds.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-xl">
                No Requests
              </div>
            ) : (
              pendingRefunds.map((booking: Booking) => (
                <div key={booking.id} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 transition-colors">
                        <DollarSign size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {booking.user.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                          Rs. {booking.totalPrice.toLocaleString()} •{" "}
                          {booking.event.title}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mb-3 line-clamp-2 border-l-2 border-amber-200 pl-2">
                    "{booking.refundReason || "No reason provided"}"
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        triggerConfirm({
                          title: "Approve Refund",
                          message: `Approve refund of Rs. ${booking.totalPrice.toLocaleString()} for ${booking.user.fullName}?`,
                          onConfirm: () =>
                            processRefund({
                              id: booking.id,
                              status: "refunded",
                            }),
                        })
                      }
                      className="flex-1 py-2 rounded-lg bg-green-50 text-green-700 text-[10px] font-black uppercase hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        triggerConfirm({
                          title: "Reject Refund",
                          message: `Are you sure you want to reject this refund request?`,
                          type: "danger",
                          onConfirm: () =>
                            processRefund({
                              id: booking.id,
                              status: "refund_rejected",
                            }),
                        })
                      }
                      className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                  <div className="mt-4 h-px bg-slate-100 last:hidden"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Organizer Verification Queue */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
            Organizer Queue
            {pendingOrganizers && pendingOrganizers.length > 0 && (
              <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {pendingOrganizers.length}
              </span>
            )}
          </h2>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            {isLoadingOrganizers ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                Scanning Apps...
              </div>
            ) : !pendingOrganizers || pendingOrganizers.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-xl">
                All Clean
              </div>
            ) : (
              pendingOrganizers.map((user: User) => (
                <div key={user.id} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-100 transition-colors">
                        {user.fullName[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  {user.verificationDocs && user.verificationDocs.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {user.verificationDocs.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.startsWith('http') ? doc : `#`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1 transition-colors border border-blue-100"
                        >
                          View Doc {idx + 1}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        triggerConfirm({
                          title: "Approve Organizer",
                          message: `Verify and approve ${user.fullName} as an authorized organizer?`,
                          onConfirm: () =>
                            verifyOrganizer({
                              id: user.id,
                              verify: true,
                            }),
                        })
                      }
                      className="flex-1 py-2 rounded-lg bg-green-50 text-green-700 text-[10px] font-black uppercase hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        triggerConfirm({
                          title: "Reject Organizer",
                          message: `Are you sure you want to reject the application for ${user.fullName}?`,
                          type: "danger",
                          onConfirm: () =>
                            verifyOrganizer({
                              id: user.id,
                              verify: false,
                            }),
                        })
                      }
                      className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                  <div className="mt-4 h-px bg-slate-100 last:hidden"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sponsorship / Boost Queue Card
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
            Boost Requests
            {pendingSponsorships && pendingSponsorships.length > 0 && (
              <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {pendingSponsorships.length}
              </span>
            )}
          </h2>

          <div className="space-y-6 max-h-100 overflow-y-auto pr-2">
            {isLoadingSponsorships ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                Scanning Requests...
              </div>
            ) : !pendingSponsorships || pendingSponsorships.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-xl">
                All Clean
              </div>
            ) : (
              pendingSponsorships.map((event: BuzzBeeEvent) => (
                <div key={event.id} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 transition-colors">
                        <DollarSign size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                          {event.organizer?.fullName || "Organizer"} • Rs. {event.price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mb-3 line-clamp-1 border-l-2 border-purple-200 pl-2">
                     Event Boost / Sponsorship Request
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        triggerConfirm({
                          title: "Approve Boost",
                          message: `Approve sponsorship/boost for ${event.title}?`,
                          onConfirm: () =>
                            updateSponsorship({
                              id: Number(event.id),
                              status: "APPROVED",
                            }),
                        })
                      }
                      className="flex-1 py-2 rounded-lg bg-green-50 text-green-700 text-[10px] font-black uppercase hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        triggerConfirm({
                          title: "Reject Boost",
                          message: `Are you sure you want to reject this boost request?`,
                          type: "danger",
                          onConfirm: () =>
                            updateSponsorship({
                              id: Number(event.id),
                              status: "REJECTED",
                            }),
                        })
                      }
                      className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                  <div className="mt-4 h-px bg-slate-100 last:hidden"></div>
                </div>
              ))
            )}
          </div>
        </div> //CLOSE DIV */}
      </div>

      <ConfirmationModal
        {...confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
