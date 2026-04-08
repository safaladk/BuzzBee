"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Event } from "@/lib/types";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Zap,
  Tag,
  Users,
  DollarSign,
  Info,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchEvent = useCallback(async () => {
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
        throw new Error("Failed to fetch event data.");
      }

      const data = await response.json();
      const events = Array.isArray(data) ? data : data.data || [];
      const foundEvent = events.find((e: any) => String(e.id) === String(id));

      if (!foundEvent) {
        throw new Error(
          "Event not found or you don't have permission to view it.",
        );
      }

      setEvent(foundEvent);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id, fetchEvent]);

  const requestBoost = async () => {
    if (!event) return;
    try {
      setBoosting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${event.id}/request-sponsor`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to request boost");
      }

      setBoostSuccess(true);
      setEvent((prev) =>
        prev ? { ...prev, sponsorshipStatus: "PENDING" } : prev,
      );

      setTimeout(() => {
        setBoostModalOpen(false);
        setBoostSuccess(false);
      }, 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBoosting(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!event) return;
    try {
      setCancelling(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${event.id}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to cancel event");
      }

      setCancelModalOpen(false);
      await fetchEvent(); // Refresh data
      alert("Event has been cancelled and all attendees have been refunded in BuzzBee points.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Cancellation failed");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
        <p className="text-red-500 mb-6">{error || "Event not found"}</p>
        <Link href="/organizer/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isBoostEligible =
    !event.isSponsored &&
    event.sponsorshipStatus !== "PENDING" &&
    event.status === "APPROVED";

  const canCancel = event.status !== "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button
          onClick={() => router.push("/organizer/dashboard")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8 flex flex-col md:flex-row">
          <div className="md:w-1/3 min-h-[300px] bg-gray-200 relative">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {event.status === "APPROVED" && event.isPublished && (
              <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Published
              </div>
            )}
            {event.status === "CANCELLED" && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Cancelled
              </div>
            )}
            {event.isSponsored && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Zap size={14} /> Sponsored
              </div>
            )}
          </div>
          <div className="md:w-2/3 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                  {event.title}
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 text-indigo-500" size={20} />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 text-indigo-500" size={20} />
                  <span>{event.time || "TBD"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 text-indigo-500" size={20} />
                  <span>
                    {event.location}, {event.district}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Tag className="mr-2 text-indigo-500" size={20} />
                  <span>{event.category}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 border-t border-gray-100 pt-6">
              {event.status !== "CANCELLED" && (
                <Link href={`/organizer/create-event?id=${event.id}`}>
                  <Button
                    variant="outline"
                    className="bg-white text-gray-700"
                  >
                    Edit Event
                  </Button>
                </Link>
              )}

              {isBoostEligible && event.status !== "CANCELLED" && (
                <Button
                  className="bg-linear-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border-none shadow-lg transition-all"
                  icon={<Zap size={18} />}
                  onClick={() => setBoostModalOpen(true)}
                >
                  Boost Event
                </Button>
              )}
              
              {canCancel && (
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setCancelModalOpen(true)}
                >
                  Cancel Event
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-full mb-3">
              <Users size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Attendees</p>
            <p className="text-2xl font-bold text-gray-900">
              {event.attendees || 0} / {event.capacity || "Unlimited"}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
            <div className="bg-green-50 text-green-600 p-3 rounded-full mb-3">
              <DollarSign size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Ticket Price
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {Number(event.price) > 0 ? `Rs. ${event.price}` : "Free"}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-full mb-3">
              <DollarSign size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-gray-900">
              Rs. {event.revenue || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-full mb-3">
              <Info size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Status</p>
            <p
              className={`text-xl font-bold ${event.status === "APPROVED" ? "text-green-600" : event.status === "PENDING" ? "text-yellow-600" : "text-red-600"}`}
            >
              {event.status}
            </p>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About the Event
          </h2>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {event.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Boost Modal */}
      <Modal
        isOpen={boostModalOpen}
        onClose={() => !boosting && setBoostModalOpen(false)}
        title="Boost Your Event"
      >
        {boostSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Request Submitted!
            </h3>
            <p className="text-gray-600">
              Your boost request has been successfully sent to the admin.
            </p>
          </div>
        ) : (
          <div className="py-2">
            <div className="flex items-center gap-4 mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="bg-white p-3 rounded-full shadow-sm text-amber-500">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="font-bold text-amber-900">Premium Placement</h4>
                <p className="text-sm text-amber-700">
                  Reach up to 10x more attendees
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
            <ul className="space-y-3 text-sm text-gray-600 mb-8 list-disc pl-5">
              <li>Submit your boost request to our admin team.</li>
              <li>Our team will review your event for eligibility.</li>
              <li>
                <strong className="text-gray-900">
                  The admin will contact you
                </strong>{" "}
                regarding approval and the associated fee processing.
              </li>
              <li>
                Once confirmed and processed, your event will be featured
                prominently on the attendee homepage.
              </li>
            </ul>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setBoostModalOpen(false)}
                disabled={boosting}
              >
                Cancel
              </Button>
              <Button
                className="flex-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border-none"
                onClick={requestBoost}
                disabled={boosting}
              >
                {boosting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => !cancelling && setCancelModalOpen(false)}
        title="Cancel Event"
      >
        <div className="py-2">
          <div className="flex items-center gap-4 mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-700">
            <div className="bg-white p-3 rounded-full shadow-sm text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-bold">Dangerous Action</h4>
              <p className="text-sm">This action cannot be undone.</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6 font-medium">
            Are you sure you want to cancel <span className="font-black text-gray-900">&quot;{event.title}&quot;</span>? 
            <br /><br />
            By cancelling, all confirmed attendees will be automatically notified and <span className="text-red-600 font-bold">100% of their ticket price</span> will be refunded as <span className="bg-brand-coral/10 text-brand-coral px-1 rounded">BuzzBee points</span> to their wallet.
          </p>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCancelModalOpen(false)}
              disabled={cancelling}
            >
              No, Keep Event
            </Button>
            <Button
              className="flex-2 bg-red-600 text-white hover:bg-red-700 border-none"
              onClick={handleCancelEvent}
              disabled={cancelling}
            >
              {cancelling ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Cancelling...
                </div>
              ) : "Yes, Cancel Event"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
