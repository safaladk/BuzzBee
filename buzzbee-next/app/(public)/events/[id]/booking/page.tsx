"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useEvent } from "@/features/events/queries";
import { useCreateBooking } from "@/features/bookings/queries";
import { useCreatePaymentIntent } from "@/features/payments/queries";
import { PaymentIntentSession } from "@/features/payments/services";
import { TicketPurchaseCard } from "@/features/bookings/components/TicketPurchaseCard";
import { useAuth } from "@/app/providers/auth-provider";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Calendar,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

type CardPaymentPanelProps = {
  checkoutSession: PaymentIntentSession;
  isSubmitting: boolean;
  onCancel: () => void;
  onPaymentSucceeded: (paymentIntentId: string) => Promise<void>;
};

function CardPaymentPanel({
  checkoutSession,
  isSubmitting,
  onCancel,
  onPaymentSucceeded,
}: CardPaymentPanelProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  async function handleConfirmPayment() {
    if (!stripe || !elements) {
      setCardError("Stripe is still loading. Please try again in a moment.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError("Card input is unavailable. Please refresh and try again.");
      return;
    }

    setCardError(null);
    setIsConfirming(true);

    const result = await stripe.confirmCardPayment(checkoutSession.clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      setCardError(result.error.message || "Payment failed. Please try again.");
      setIsConfirming(false);
      return;
    }

    const paymentIntentId = result.paymentIntent?.id;
    if (!paymentIntentId) {
      setCardError("Payment confirmation failed. Please try again.");
      setIsConfirming(false);
      return;
    }

    try {
      await onPaymentSucceeded(paymentIntentId);
    } catch {
      setCardError(
        "Payment was successful but booking confirmation failed. Please contact support.",
      );
    } finally {
      setIsConfirming(false);
    }
  }

  const isBusy = isConfirming || isSubmitting;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md border border-gray-100 space-y-4">
      <h3 className="text-base font-bold text-gray-900">Pay with Card</h3>
      <p className="text-sm text-gray-600">
        Amount: <span className="font-semibold text-gray-900">Rs {checkoutSession.totalPrice.toFixed(2)}</span>
      </p>

      <div className="rounded-xl border border-gray-200 p-3 bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#111827",
                "::placeholder": {
                  color: "#9CA3AF",
                },
              },
              invalid: {
                color: "#DC2626",
              },
            },
          }}
        />
      </div>

      {cardError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {cardError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleConfirmPayment}
          disabled={isBusy}
          className="flex-1 bg-brand-coral text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 disabled:opacity-70"
        >
          {isBusy ? "Confirming..." : "Pay and Confirm Booking"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-70"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

type PayloadProps = { params: Promise<{ id: string }> };

export default function EventBookingPage({ params }: PayloadProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const { data: event, isLoading } = useEvent(id);
  const {
    mutateAsync: createBooking,
    isPending,
    error: bookingError,
  } = useCreateBooking();
  const {
    mutateAsync: createPaymentIntent,
    isPending: isCreatingPaymentIntent,
  } = useCreatePaymentIntent();
  const [confirmed, setConfirmed] = useState(false);
  const [checkoutSession, setCheckoutSession] =
    useState<PaymentIntentSession | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  const capacity = event.capacity ?? 500;
  const sold = event.attendees ?? 0;
  const left = Math.max(capacity - sold, 0);

  async function handleBook({
    qty,
    pointsUsed,
  }: {
    qty: number;
    pointsUsed: number;
  }) {
    setCheckoutError(null);
    const price = Number(event?.price || 0);
    const serviceFee = Number(event?.serviceFee || 0);
    const totalPrice = price * qty + serviceFee;
    const remainingToPay = totalPrice - pointsUsed;

    if (remainingToPay <= 0) {
      try {
        await createBooking({
          eventId: Number(event?.id),
          quantity: qty,
          totalPrice,
          pointsUsed: pointsUsed,
        });
        setConfirmed(true);
      } catch (err: any) {
        setCheckoutError(err?.message || "Booking failed.");
      }
      return;
    }

    if (!stripePromise) {
      setCheckoutError(
        "Stripe configuration missing. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
      );
      return;
    }

    try {
      const session = await createPaymentIntent({
        eventId: Number(event?.id),
        quantity: qty,
        pointsUsed: pointsUsed,
      });
      setCheckoutSession(session);
    } catch (err: any) {
      setCheckoutError(err?.message || "Unable to start checkout.");
    }
  }

  async function handlePaymentSucceeded(paymentIntentId: string) {
    if (!checkoutSession) return;

    await createBooking({
      eventId: checkoutSession.eventId,
      quantity: checkoutSession.quantity,
      totalPrice: checkoutSession.totalPrice,
      paymentIntentId,
      pointsUsed: checkoutSession.pointsUsed,
    });

    setCheckoutSession(null);
    setConfirmed(true);
  }

  const isFree = Number(event.price) === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/events/${event.id}`}
            className="text-brand-coral hover:underline text-sm mb-4 inline-block font-semibold"
          >
            ← Back to Event Details
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                Complete Your Booking
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                For:{" "}
                <span className="font-bold text-gray-900">{event.title}</span>
              </p>
            </div>
          </div>
        </div>

        {(bookingError || checkoutError) && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-red-700 shadow-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-medium">
              {(bookingError as any)?.message ||
                checkoutError ||
                "There was an issue processing your booking."}
            </p>
          </div>
        )}

        {checkoutError && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-red-700 shadow-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-medium">{checkoutError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100">
              <div className="flex gap-4 items-start mb-6">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-100"
                  />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar size={16} className="text-brand-coral" />
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin size={16} className="text-brand-coral" />
                      {event.location}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {event.description ||
                      `Join us for this exciting ${event.category} event.`}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <h3 className="font-bold text-gray-900">
                    Live Ticket Availability
                  </h3>
                  <span className="text-brand-coral font-bold">
                    {left} remaining
                  </span>
                </div>
                <ProgressBar value={sold} total={capacity} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-brand-coral" />
                BuzzBee Ticketing Promise
              </h2>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                Your tickets are protected by our Buyer Guarantee. If the event
                is postponed or cancelled, you&apos;re 100% covered. We use
                secure encryption for all transactions.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <TicketPurchaseCard
                price={Number(event.price) || 0}
                currency={isFree ? "Free" : "Rs."}
                serviceFee={isFree ? 0 : Number(event.serviceFee || 0)}
                paymentOptions={["eSewa", "Khalti", "Card"]}
                stats={[
                  "Secure checkout",
                  "Instant confirmation",
                  "Buyer Protection",
                ]}
                maxTicketsPerUser={event.maxTicketsPerUser}
                onBook={handleBook}
                userPointsBalance={user?.pointsBalance || 0}
              />

              {checkoutSession && stripePromise && (
                <Elements stripe={stripePromise}>
                  <CardPaymentPanel
                    checkoutSession={checkoutSession}
                    isSubmitting={isPending}
                    onCancel={() => {
                      setCheckoutSession(null);
                      setCheckoutError(null);
                    }}
                    onPaymentSucceeded={handlePaymentSucceeded}
                  />
                </Elements>
              )}

              {confirmed && (
                <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-green-800 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={24}
                      className="text-green-600 shrink-0 mt-0.5"
                    />
                    <div className="space-y-1">
                      <p className="font-bold text-lg leading-tight text-green-900">
                        Successfully Booked!
                      </p>
                      <p className="text-sm text-green-700">
                        Your digital ticket is ready. You can find it in your My
                        Tickets section and we&apos;ve also sent the details to
                        your email.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href="/ticketing"
                      className="w-full text-center bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-green-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Go to My Tickets
                    </Link>
                    <Link
                      href={`/events/${event.id}`}
                      className="w-full text-center text-sm font-bold text-gray-600 hover:text-brand-coral transition-colors"
                    >
                      Back to Event Details
                    </Link>
                  </div>
                </div>
              )}

              {(isPending || isCreatingPaymentIntent) && (
                <div className="text-center p-4 bg-white/50 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 font-medium flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-coral"></div>
                  {isCreatingPaymentIntent
                    ? "Preparing secure payment session..."
                    : "Finalizing your booking..."}
                </div>
              )}

              {isCreatingPaymentIntent && (
                <div className="text-center p-4 bg-white/50 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 font-medium flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-coral"></div>
                  Preparing secure payment session...
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
