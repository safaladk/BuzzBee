import React, { useState } from "react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Zap, Check, Loader2, Rocket, Calendar } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  useCreateSponsorshipIntent,
  useVerifySponsorship,
} from "@/features/payments/queries";
import { SponsorshipIntentSession } from "@/features/payments/services";
import { Event } from "@/lib/types";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const SPONSORSHIP_PLANS = [
  {
    days: 3,
    price: 500,
    label: "Starter Boost",
    description: "Get noticed for 3 days",
  },
  {
    days: 7,
    price: 1000,
    label: "Weekly Growth",
    description: "Best for short-term events",
  },
  {
    days: 30,
    price: 3500,
    label: "Monthly Premiere",
    description: "Maximum visibility for a month",
  },
];

interface BoostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSuccess: () => void;
}

function PaymentPanel({
  session,
  onSuccess,
  onCancel,
}: {
  session: SponsorshipIntentSession;
  onSuccess: (id: string) => Promise<void>;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    const cardEl = elements.getElement(CardElement);
    if (!cardEl) return;

    setError(null);
    setLoading(true);

    const result = await stripe.confirmCardPayment(session.clientSecret, {
      payment_method: { card: cardEl },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
      setLoading(false);
    } else if (result.paymentIntent?.status === "succeeded") {
      await onSuccess(result.paymentIntent.id);
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-sm text-amber-900">
          You are paying <span className="font-bold">Rs. {session.amount}</span>{" "}
          for a <span className="font-bold">{session.days} day</span> boost.
        </p>
      </div>

      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handlePay}
          disabled={loading}
          className="flex-1 bg-brand-coral text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Rocket size={18} />
          )}
          {loading ? "Processing..." : "Pay and Boost Now"}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function BoostEventModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: BoostEventModalProps) {
  const [step, setStep] = useState<"plans" | "pay" | "success">("plans");
  const [session, setSession] = useState<SponsorshipIntentSession | null>(null);

  const { mutateAsync: createIntent, isPending: isCreatingIntent } =
    useCreateSponsorshipIntent();
  const { mutateAsync: verifySponsorship } = useVerifySponsorship();

  const handleSelectPlan = async (plan: (typeof SPONSORSHIP_PLANS)[0]) => {
    try {
      const res = await createIntent({
        eventId: Number(event.id),
        days: plan.days,
      });
      setSession(res);
      setStep("pay");
    } catch {
      alert("Failed to start payment session. Please try again.");
    }
  };

  const handlePaymentSucceeded = async (id: string) => {
    try {
      await verifySponsorship({
        paymentIntentId: id,
        eventId: Number(event.id),
      });
      setStep("success");
      onSuccess();
    } catch {
      alert(
        "Payment was successful but activation failed. Please contact support.",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Boost Your Event" size="md">
      <div className="py-2">
        {step === "plans" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-brand-coral/5 rounded-2xl border border-brand-coral/10 mb-4">
              <div className="bg-brand-coral p-3 rounded-xl">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 ">
                  Reach more attendees!
                </h4>
                <p className="text-xs text-gray-600">
                  Boosted events appear at the top of the search and home page.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SPONSORSHIP_PLANS.map((plan) => (
                <button
                  key={plan.days}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCreatingIntent}
                  className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 hover:border-brand-coral hover:bg-brand-coral/5 transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 group-bg-brand-coral group-hover:text-white p-3 rounded-xl transition-colors">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{plan.label}</p>
                      <p className="text-xs text-gray-500">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-coral text-lg leading-tight">
                      Rs. {plan.price}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {plan.days} Days
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {isCreatingIntent && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="animate-spin" size={16} />
                Initializing payment...
              </div>
            )}
          </div>
        )}

        {step === "pay" && session && stripePromise && (
          <Elements stripe={stripePromise}>
            <PaymentPanel
              session={session}
              onSuccess={handlePaymentSucceeded}
              onCancel={() => setStep("plans")}
            />
          </Elements>
        )}

        {step === "success" && (
          <div className="text-center py-8 space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <Check size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 italic">
                Event Boosted!
              </h3>
              <p className="text-gray-600 mt-2">
                Your event is now live in the sponsored section.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
