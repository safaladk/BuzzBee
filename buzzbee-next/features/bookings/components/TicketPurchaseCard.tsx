"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  price: number;
  currency?: string;
  serviceFee?: number;
  onBook: (qty: number) => void;
  showQuantitySelector?: boolean;
  paymentOptions?: string[];
  stats?: string[];
  maxTicketsPerUser?: number;
}

export function TicketPurchaseCard({
  price,
  currency = "Rs.",
  serviceFee = 25,
  onBook,
  showQuantitySelector = true,
  paymentOptions = [],
  stats = [],
  maxTicketsPerUser,
}: Props) {
  const [qty, setQty] = useState(1);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const subtotal = useMemo(() => price * qty, [price, qty]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  return (
    <div className="rounded-2xl bg-white shadow-md p-6">
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">
          {currency} {price}
        </p>
        <span className="text-sm text-gray-500">per person</span>
      </div>

      <p className="text-sm text-gray-500 mt-1">All fees included</p>

      {/* Qty */}
      {showQuantitySelector && (
        <div className="mt-4">
          <p className="font-semibold text-gray-800 mb-2">Number of Tickets</p>
          <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
            <button
              className="h-8 w-8 rounded-md bg-gray-100 text-gray-900 font-bold"
              onClick={() => {
                setLimitMessage(null);
                setQty((q) => Math.max(1, q - 1));
              }}
            >
              -
            </button>
            <span className="w-6 text-center font-semibold text-gray-800">
              {qty}
            </span>
            <button
              className="h-8 w-8 rounded-md bg-gray-100 text-gray-900 font-bold"
              onClick={() => {
                if (
                  maxTicketsPerUser &&
                  maxTicketsPerUser > 0 &&
                  qty >= maxTicketsPerUser
                ) {
                  setLimitMessage(
                    `The max amount of tickets you can buy is ${maxTicketsPerUser}`,
                  );
                } else {
                  setQty((q) => q + 1);
                  setLimitMessage(null);
                }
              }}
            >
              +
            </button>
          </div>
          {limitMessage && (
            <p className="text-sm text-red-600 mt-2 font-medium bg-red-50 p-2 rounded-md border border-red-200">
              {limitMessage}
            </p>
          )}
        </div>
      )}

      {/* Summary */}
      {showQuantitySelector && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-semibold">
              {currency} {subtotal}
            </span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Service Fee</span>
            <span className="font-semibold">
              {currency} {serviceFee}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-brand-coral">
              {currency} {total}
            </span>
          </div>
        </div>
      )}

      <div className="mt-5">
        <label className="flex items-start gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (e.target.checked) setTermsError(false);
            }}
            className="mt-1 accent-brand-coral"
          />
          <span>
            I agree to the{" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowTermsModal(true);
              }}
              className="text-brand-coral hover:underline font-semibold cursor-pointer"
            >
              Attendee Privacy Policy and Terms of Service
            </button>
          </span>
        </label>
        {termsError && (
          <p className="text-red-500 text-xs mb-3 -mt-2">
            You must agree to the terms to proceed.
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            if (!agreeTerms) {
              setTermsError(true);
              return;
            }
            onBook(qty);
          }}
          className="w-full cursor-pointer"
        >
          Book Now
        </Button>
        {!!paymentOptions.length && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Secure payment via
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          {paymentOptions.map((p) => (
            <span
              key={p}
              className="px-3 py-1 rounded-lg bg-brand-peach/40 text-brand-navy text-sm font-semibold"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {!!stats.length && (
        <ul className="mt-5 space-y-2 text-sm text-gray-700">
          {stats.map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              <ShieldCheck className="text-brand-navy" size={16} />
              {s}
            </li>
          ))}
        </ul>
      )}

      {showTermsModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold">Attendee Privacy Policy</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-gray-600 space-y-4">
              <h4 className="font-semibold text-gray-800">
                1. Data Collection
              </h4>
              <p>
                We collect your necessary name and email address to process your
                ticket. This information is shared uniquely with the event
                organizer to manage attendee lists.
              </p>

              <h4 className="font-semibold text-gray-800">
                2. Payment Processing
              </h4>
              <p>
                Your payment details are processed securely by third-party
                providers (eSewa, Khalti, Stripe). We do not store your raw
                credit card or bank details.
              </p>

              <h4 className="font-semibold text-gray-800">3. Ticket Policy</h4>
              <p>
                All sales are final subject to the Organizer&apos;s refund
                policy. BuzzBee acts solely as the ticketing platform.
              </p>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <Button
                onClick={() => {
                  setAgreeTerms(true);
                  setTermsError(false);
                  setShowTermsModal(false);
                }}
              >
                I Agree
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
