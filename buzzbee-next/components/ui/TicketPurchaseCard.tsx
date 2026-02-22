"use client";

import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "./Button";

interface Props {
  price: number;
  currency?: string;
  serviceFee?: number;
  onBook: (qty: number) => void;
  paymentOptions?: string[];
  stats?: string[];
}

export function TicketPurchaseCard({
  price,
  currency = "Rs.",
  serviceFee = 25,
  onBook,
  paymentOptions = [],
  stats = [],
}: Props) {
  const [qty, setQty] = useState(1);
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
      <div className="mt-4">
        <p className="font-semibold text-gray-800 mb-2">Number of Tickets</p>
        <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
          <button
            className="h-8 w-8 rounded-md bg-gray-100 text-gray-900 font-bold"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <span className="w-6 text-center font-semibold text-gray-800">
            {qty}
          </span>
          <button
            className="h-8 w-8 rounded-md bg-gray-100 text-gray-900 font-bold"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Summary */}
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

      <div className="mt-5">
        <Button
          variant="primary"
          size="lg"
          onClick={() => onBook(qty)}
          className="w-full"
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
    </div>
  );
}
