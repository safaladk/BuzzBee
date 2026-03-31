"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Calendar,
  DollarSign,
  ShieldCheck,
  Search,
  LayoutDashboard,
  Settings,
  Menu,
  Bell,
} from "lucide-react";
import {
  usePendingEvents,
  usePendingOrganizers,
  usePendingSponsorships,
} from "@/features/admin/queries";
import { usePendingRefunds } from "@/features/bookings/queries";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { data: pendingEvents } = usePendingEvents();
  const { data: pendingOrganizers } = usePendingOrganizers();
  const { data: pendingRefunds } = usePendingRefunds();
  const { data: pendingSponsorships } = usePendingSponsorships();

  const eventsCount = pendingEvents?.length || 0;
  const organizersCount = pendingOrganizers?.length || 0;
  const refundsCount = pendingRefunds?.length || 0;
  const sponsorshipsCount = pendingSponsorships?.length || 0;

  const totalActionItems =
    eventsCount + organizersCount + refundsCount + sponsorshipsCount;
  const verificationsCount = eventsCount + organizersCount + sponsorshipsCount;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Design */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <span className="font-bold text-xl text-slate-800 tracking-tight">
            BuzzBee
          </span>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
            Admin
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname === "/admin"
                ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            href="/admin/events"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname.startsWith("/admin/events")
                ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Calendar size={20} /> Events Management
          </Link>
          <Link
            href="/admin/users"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname.startsWith("/admin/users")
                ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users size={20} /> User Accounts
          </Link>
          <Link
            href="/admin/verifications"
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname.startsWith("/admin/verifications")
                ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} /> Verifications
            </div>
            {verificationsCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  pathname.startsWith("/admin/verifications")
                    ? "bg-white text-brand-coral"
                    : "bg-brand-coral text-white"
                }`}
              >
                {verificationsCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/refunds"
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname.startsWith("/admin/refunds")
                ? "bg-brand-coral text-white shadow-md shadow-brand-coral/20"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign size={20} /> Refund Requests
            </div>
            {refundsCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  pathname.startsWith("/admin/refunds")
                    ? "bg-white text-brand-coral"
                    : "bg-brand-coral text-white"
                }`}
              >
                {refundsCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Settings size={20} /> Global Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen max-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <Menu className="text-slate-600 cursor-pointer" />
            <span className="font-bold text-xl text-brand-coral italic">
              BuzzBee
            </span>
          </div>

          <div className="relative hidden md:block w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users, events or transactions..."
              className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-coral/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={
                refundsCount > 0
                  ? "/admin/refunds"
                  : verificationsCount > 0
                    ? "/admin/verifications"
                    : "/admin"
              }
              className="p-2 text-slate-400 hover:text-brand-coral relative transition-colors"
            >
              <Bell size={20} />
              {totalActionItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                  {totalActionItems}
                </span>
              )}
            </Link>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  Admin User
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-black mt-1 tracking-wider">
                  Super Admin
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-coral to-brand-peach flex items-center justify-center text-white font-bold shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
