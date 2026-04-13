"use client";

import { CheckCircle2, FileText, XCircle } from "lucide-react";

interface QueueItem {
  id: number;
  title: string;
  subtitle: string;
  avatar?: string;
  avatarFallback?: string;
  note?: string;
  docs?: string[];
}

interface QueueCardProps {
  title: string;
  items: QueueItem[];
  emptyMessage?: string;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const QueueCard = ({
  title,
  items,
  emptyMessage = "All clear",
  onApprove,
  onReject,
}: QueueCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h3 className="text-base font-bold text-brand-navy">{title}</h3>
      {items.length > 0 && (
        <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-brand-coral/15 text-brand-coral text-[10px] font-black">
          {items.length}
        </span>
      )}
    </div>

    <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
      {items.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-slate-500 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="px-5 py-4 group hover:bg-brand-peach/20 transition-colors">
            <div className="flex items-center gap-3">
              {item.avatarFallback ? (
                <div className="h-9 w-9 rounded-full bg-brand-coral/15 text-brand-coral font-bold text-sm flex items-center justify-center shrink-0">
                  {item.avatarFallback}
                </div>
              ) : (
                <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <FileText size={14} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
              </div>
            </div>

            {item.note && (
              <p className="mt-2 text-xs text-slate-500 italic pl-12">"{item.note}"</p>
            )}

            {item.docs && item.docs.length > 0 && (
              <div className="mt-2 flex gap-2 pl-12 flex-wrap">
                {item.docs.map((_, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold text-brand-navy underline cursor-pointer"
                  >
                    View Doc {idx + 1}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex gap-2 pl-12">
              <button
                onClick={() => onApprove?.(item.id)}
                className="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 text-[10px] font-black uppercase tracking-wider hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1"
              >
                <CheckCircle2 size={12} /> Approve
              </button>
              <button
                onClick={() => onReject?.(item.id)}
                className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-wider hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1"
              >
                <XCircle size={12} /> Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default QueueCard;
