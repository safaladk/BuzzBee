"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Plus,
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Cookies from "js-cookie";
import { Event } from "@/lib/types";
import { useAuth } from "@/app/providers/auth-provider";
import { BoostEventModal } from "@/features/events/components/BoostEventModal";

interface OrganizerEvent extends Omit<Event, "status"> {
  displayStatus: "published" | "draft" | "ended";
  status: Event["status"];
}

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [selectedEventForBoost, setSelectedEventForBoost] =
    useState<OrganizerEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/my-events?_=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("You currently have not organized any events.");
      }

      const data = await response.json();
      console.debug("Organizer dashboard fetched events:", data);
      // Map events to organizer
      const formattedEvents = (
        Array.isArray(data) ? data : data.data || []
      ).map((event: Event) => ({
        ...event,
        title: event.title,
        description: event.description,
        date: event.date,
        price: Number(event.price) || 0,
        isPublished: !!event.isPublished,
        displayStatus: event.isPublished ? "published" : "draft",
        attendees: event.attendees || 0,
        revenue: Number(event.revenue) || 0,
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openDeleteModal = (id: string) => {
    setSelectedEventId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedEventId(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedEventId) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${selectedEventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to delete event");
      await fetchEvents();
      closeDeleteModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const openBoostModal = (event: OrganizerEvent) => {
    setSelectedEventForBoost(event);
    setBoostModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Organizer Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your events and track performance
            </p>
          </div>
          <Link href="/organizer/create-event">
            <Button
              icon={<Plus size={20} />}
              variant="outline"
              className="w-full border-amber-500 text-white bg-amber-600 cursor-pointer"
            >
              Create Event
            </Button>
          </Link>
        </div>

        {/* Verification Alert */}
        {!user?.isVerified && (
          <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4 text-amber-800">
              <div className="bg-amber-100 p-3 rounded-xl shrink-0">
                <AlertTriangle size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Verify Your Account</h3>
                <p className="text-sm opacity-90">
                  Unlock all features of the platform and build trust with your
                  audience.
                </p>
              </div>
            </div>
            <Link href="/organizer/verify" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full bg-white border-amber-500 text-amber-600 hover:bg-amber-600"
              >
                Start Verification
              </Button>
            </Link>
          </div>
        )}

        {user?.isVerified && (
          <div className="mb-8 rounded-2xl bg-green-50 border border-green-200 p-4 flex items-center gap-3 text-green-800">
            <ShieldCheck size={20} className="text-green-600" />
            <span className="text-sm font-semibold">
              Your organizer account is verified.
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && events.length === 0 && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-6 flex items-center gap-4 text-red-700 animate-in fade-in slide-in-from-top-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="font-bold">No events organized yet</p>
              <p className="text-sm opacity-90">
                {error === "Failed to fetch"
                  ? "Connected but could not retrieve data."
                  : error}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading your events...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Events
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      {events.length}
                    </h3>
                  </div>
                  <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                  {deleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-black opacity-40"
                        onClick={closeDeleteModal}
                      ></div>
                      <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-2">
                          Delete event?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Are you sure you want to delete this event? This
                          action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={closeDeleteModal}
                            className="px-4 py-2 rounded-lg bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmDelete}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Attendees
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      {events.reduce((acc, e) => acc + (e.attendees || 0), 0)}
                    </h3>
                  </div>
                  <div className="bg-pink-500 w-12 h-12 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Revenue
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      Rs.{" "}
                      {events
                        .reduce((acc, e) => acc + (e.revenue || 0), 0)
                        .toLocaleString()}
                    </h3>
                  </div>
                  <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
              </div>

              {events.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-600 mb-4">No events yet</p>
                  <Link href="/organizer/create-event">
                    <Button variant="primary" icon={<Plus size={20} />}>
                      Create Your First Event
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Event Title
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Attendees
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr
                          key={event.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {event.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {(event.price || 0) > 0
                              ? `Rs. ${(event.price || 0).toLocaleString()}`
                              : "Free"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {event.attendees || 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {(event.revenue || 0) > 0
                              ? `Rs. ${(event.revenue || 0).toLocaleString()}`
                              : "Free"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                event.displayStatus === "published"
                                  ? "bg-green-100 text-green-800"
                                  : event.displayStatus === "draft"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {event.displayStatus.charAt(0).toUpperCase() +
                                event.displayStatus.slice(1)}
                            </span>
                            {event.isSponsored && (
                              <span className="ml-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 shadow-md shadow-amber-500/20">
                                <Zap size={10} fill="currentColor" />
                                Boosted
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <Link href={`/organizer/events/${event.id}`}>
                                <button
                                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                                  title="View"
                                >
                                  <Eye size={18} />
                                </button>
                              </Link>
                              <Link
                                href={`/organizer/create-event?id=${event.id}`}
                              >
                                <button
                                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                              </Link>
                              <button
                                onClick={() =>
                                  openDeleteModal(String(event.id))
                                }
                                className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            {user?.isVerified &&
                              event.status === "APPROVED" && (
                                <button
                                  onClick={() => openBoostModal(event)}
                                  className={`mt-2 w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
                                    event.isSponsored
                                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                      : "bg-brand-coral text-white hover:scale-105 active:scale-95 shadow-brand-coral/20"
                                  }`}
                                >
                                  <Zap
                                    size={14}
                                    fill={
                                      event.isSponsored
                                        ? "currentColor"
                                        : "white"
                                    }
                                  />
                                  {event.isSponsored
                                    ? "Extend Boost"
                                    : "Boost Event"}
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedEventForBoost && (
        <BoostEventModal
          isOpen={boostModalOpen}
          onClose={() => {
            setBoostModalOpen(false);
            setSelectedEventForBoost(null);
          }}
          event={selectedEventForBoost as unknown as Event}
          onSuccess={() => {
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}
