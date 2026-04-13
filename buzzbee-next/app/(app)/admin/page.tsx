"use client";

import { useState } from "react";
import {
  Users,
  Calendar,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Bell,
  Search,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatCard from "@/components/admin/StatCard";
import QueueCard from "@/components/admin/QueueCard";
import { useStats } from "@/features/stats/queries";
import {
  usePendingEvents,
  useVerifyEvent,
  usePendingOrganizers,
  useVerifyOrganizer,
} from "@/features/admin/queries";
import { usePendingRefunds, useProcessRefund } from "@/features/bookings/queries";
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
  const { data: pendingEvents } = usePendingEvents();
  const { data: pendingOrganizers } = usePendingOrganizers();
  const { data: pendingRefunds } = usePendingRefunds();

  const { mutate: verifyEvent } = useVerifyEvent();
  const { mutate: verifyOrganizer } = useVerifyOrganizer();
  const { mutate: processRefund } = useProcessRefund();

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
      change: `${pendingOrganizers?.length ?? 0} organizer apps pending`,
      icon: Users,
      accentClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Events",
      value: platformStats ? platformStats.eventsCount.toLocaleString() : "...",
      change: `${pendingEvents?.length ?? 0} waiting for review`,
      icon: Calendar,
      accentClass: "bg-brand-peach/20 text-brand-coral",
    },
    {
      label: "Organizers",
      value: platformStats ? platformStats.organizersCount.toLocaleString() : "...",
      change: `${platformStats?.citiesCount ?? 0} cities covered`,
      icon: ShieldCheck,
      accentClass: "bg-amber-100 text-amber-700",
    },
    {
      label: "Revenue",
      value: platformStats
        ? `Rs. ${platformStats.totalRevenue.toLocaleString()}`
        : "...",
      change: `${pendingRefunds?.length ?? 0} refund requests`,
      icon: DollarSign,
      accentClass: "bg-emerald-100 text-emerald-700",
    },
  ];

  const eventQueueItems =
    pendingEvents?.map((event) => ({
      id: Number(event.id),
      title: event.title,
      subtitle: `${event.category} • ${event.district}`,
      avatarFallback: event.title[0]?.toUpperCase() || "E",
    })) ?? [];

  const refundQueueItems =
    pendingRefunds?.map((booking) => ({
      id: Number(booking.id),
      title: booking.user.fullName,
      subtitle: `Rs. ${booking.totalPrice.toLocaleString()} • ${booking.event.title}`,
      note: booking.refundReason || "No reason provided",
      avatarFallback: booking.user.fullName[0]?.toUpperCase() || "R",
    })) ?? [];

  const organizerQueueItems =
    pendingOrganizers?.map((user) => ({
      id: Number(user.id),
      title: user.fullName,
      subtitle: user.email,
      docs: user.verificationDocs,
      avatarFallback: user.fullName[0]?.toUpperCase() || "O",
    })) ?? [];

  const recentActivity = [
    ...(pendingOrganizers?.slice(0, 2).map((user) => ({
      key: `org-${user.id}`,
      text: `New organizer application from ${user.fullName}`,
      meta: user.email,
    })) ?? []),
    ...(pendingEvents?.slice(0, 2).map((event) => ({
      key: `event-${event.id}`,
      text: `Event \"${event.title}\" submitted for review.`,
      meta: `${event.category} • ${event.district}`,
    })) ?? []),
    ...(pendingRefunds?.slice(0, 2).map((booking) => ({
      key: `refund-${booking.id}`,
      text: `Refund request from ${booking.user.fullName}.`,
      meta: `Rs. ${booking.totalPrice.toLocaleString()} • ${booking.event.title}`,
    })) ?? []),
  ].slice(0, 5);

  const notificationCount =
    eventQueueItems.length + refundQueueItems.length + organizerQueueItems.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="transition-all duration-300 md:ml-[240px]">
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/90 backdrop-blur-xl flex items-center justify-between px-6 md:px-8">
          <h1 className="text-xl font-bold text-brand-navy">Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-coral/30"
              />
            </div>

            <button className="relative h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-navy hover:bg-brand-peach/30 transition-colors">
              <Bell size={16} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-coral text-[9px] font-black text-white flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-coral to-brand-navy flex items-center justify-center text-sm font-bold text-white">
              SA
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">
              Welcome back, here is what's happening across BuzzBee today.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={i * 0.1} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <QueueCard
              title="Event Queue"
              items={eventQueueItems}
              emptyMessage="All events reviewed"
              onApprove={(id) => {
                const event = pendingEvents?.find((item) => Number(item.id) === id);
                if (!event) {
                  return;
                }

                triggerConfirm({
                  title: "Approve Event",
                  message: `Are you sure you want to approve \"${event.title}\"?`,
                  onConfirm: () => verifyEvent({ id, status: "APPROVED" }),
                });
              }}
              onReject={(id) => {
                const event = pendingEvents?.find((item) => Number(item.id) === id);
                if (!event) {
                  return;
                }

                triggerConfirm({
                  title: "Reject Event",
                  message: `Please provide a reason for rejecting \"${event.title}\".`,
                  type: "danger",
                  requiresNote: true,
                  onConfirm: (note) => verifyEvent({ id, status: "REJECTED", note }),
                });
              }}
            />

            <QueueCard
              title="Refund Requests"
              items={refundQueueItems}
              emptyMessage="No pending refunds"
              onApprove={(id) => {
                const booking = pendingRefunds?.find((item) => Number(item.id) === id);
                if (!booking) {
                  return;
                }

                triggerConfirm({
                  title: "Approve Refund",
                  message: `Approve refund of Rs. ${booking.totalPrice.toLocaleString()} for ${booking.user.fullName}?`,
                  onConfirm: () => processRefund({ id, status: "refunded" }),
                });
              }}
              onReject={(id) => {
                const booking = pendingRefunds?.find((item) => Number(item.id) === id);
                if (!booking) {
                  return;
                }

                triggerConfirm({
                  title: "Reject Refund",
                  message: "Are you sure you want to reject this refund request?",
                  type: "danger",
                  onConfirm: () => processRefund({ id, status: "refund_rejected" }),
                });
              }}
            />

            <QueueCard
              title="Organizer Applications"
              items={organizerQueueItems}
              emptyMessage="No pending applications"
              onApprove={(id) => {
                const user = pendingOrganizers?.find((item) => Number(item.id) === id);
                if (!user) {
                  return;
                }

                triggerConfirm({
                  title: "Approve Organizer",
                  message: `Verify and approve ${user.fullName} as an authorized organizer?`,
                  onConfirm: () => verifyOrganizer({ id, verify: true }),
                });
              }}
              onReject={(id) => {
                const user = pendingOrganizers?.find((item) => Number(item.id) === id);
                if (!user) {
                  return;
                }

                triggerConfirm({
                  title: "Reject Organizer",
                  message: `Are you sure you want to reject the application for ${user.fullName}?`,
                  type: "danger",
                  onConfirm: () => verifyOrganizer({ id, verify: false }),
                });
              }}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-coral" />
              <h3 className="text-base font-bold text-brand-navy">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                  No recent activity.
                </div>
              ) : (
                recentActivity.map((item) => (
                  <div
                    key={item.key}
                    className="px-5 py-3.5 flex items-start gap-3 hover:bg-brand-peach/20 transition-colors"
                  >
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-brand-coral shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-800">{item.text}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.meta}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <ConfirmationModal
        {...confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
