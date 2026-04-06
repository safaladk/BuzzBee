"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, X, Wallet, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  price: number;
  currency?: string;
  serviceFee?: number;
  onBook: (data: { qty: number; pointsUsed: number }) => void;
  showQuantitySelector?: boolean;
  paymentOptions?: string[];
  stats?: string[];
  maxTicketsPerUser?: number;
  userPointsBalance?: number;
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
  userPointsBalance = 0,
}: Props) {
  const [qty, setQty] = useState(1);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  const subtotal = useMemo(() => price * qty, [price, qty]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  const pointsToUse = usePoints ? Math.min(total, userPointsBalance) : 0;
  const remainingTotal = total - pointsToUse;
  const isFree = price === 0;

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

      {/* BuzzBee Points usage */}
      {!isFree && userPointsBalance > 0 && (
        <div className="mt-6 p-4 rounded-xl border border-brand-coral/20 bg-brand-coral/5 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-coral">
              <div className="p-1.5 bg-brand-coral/10 rounded-lg">
                <Wallet size={18} />
              </div>
              <span className="text-sm font-black uppercase tracking-wider">Use BuzzBee Points</span>
            </div>
            <button
              onClick={() => setUsePoints(!usePoints)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${usePoints ? 'bg-brand-coral' : 'bg-gray-200'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${usePoints ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Balance: {userPointsBalance.toLocaleString()} pts</span>
            {usePoints && (
              <span className="text-brand-coral">Applying: -{pointsToUse.toLocaleString()}</span>
            )}
          </div>
          {usePoints && (
            <div className="flex items-start gap-1.5 p-2 bg-white/60 rounded-lg border border-brand-coral/10">
              <Info size={12} className="text-brand-coral mt-0.5 shrink-0" />
              <p className="text-[10px] text-gray-500 font-medium leading-tight italic">
                Points will be deducted from your wallet upon booking.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-slate-500 text-xs font-bold uppercase tracking-widest">
          <span>Subtotal</span>
          <span className="text-slate-900">
            {currency} {subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-slate-500 text-xs font-bold uppercase tracking-widest">
          <span>Service Fee</span>
          <span className="text-slate-900">
            {currency} {serviceFee.toLocaleString()}
          </span>
        </div>
        {usePoints && pointsToUse > 0 && (
          <div className="flex justify-between text-brand-coral text-xs font-black uppercase tracking-widest pt-1 border-t border-dashed border-brand-coral/30">
            <span>BuzzBee Points used</span>
            <span>- {currency} {pointsToUse.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between pt-3 border-t border-slate-100 mt-2">
          <div className="flex flex-col">
            <span className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Net Payable</span>
            {usePoints && pointsToUse > 0 && remainingTotal > 0 && (
              <span className="text-[9px] text-slate-400 font-bold italic">via payment gateway</span>
            )}
          </div>
          <span className="font-black text-3xl text-brand-coral leading-none">
            {currency}{remainingTotal.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-2.5 text-xs font-bold text-slate-500 mb-5 cursor-pointer leading-relaxed">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (e.target.checked) setTermsError(false);
            }}
            className="mt-0.5 accent-brand-coral shrink-0 h-4 w-4 rounded-md"
          />
          <span>
            I agree to the{" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowTermsModal(true);
              }}
              className="text-brand-coral hover:text-brand-navy underline transition-colors"
            >
              Privacy Policy and Terms of Service
            </button>
          </span>
        </label>
        {termsError && (
          <p className="text-red-500 text-[10px] font-black uppercase mb-3 -mt-2 animate-pulse">
            * You must agree to the terms to proceed.
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
            onBook({ qty, pointsUsed: pointsToUse });
          }}
          className="w-full font-black uppercase tracking-widest text-sm py-4 shadow-xl shadow-brand-coral/10 hover:shadow-brand-coral/20 transition-all hover:scale-[1.01]"
        >
          {remainingTotal === 0 ? "Book with Points" : "Continue to Payment"}
        </Button>
        
        {!!paymentOptions.length && remainingTotal > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Checkout</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {paymentOptions.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-widest"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
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
