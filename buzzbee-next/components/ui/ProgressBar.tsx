import React from 'react';

export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = Math.min(100, Math.max(0, (value / Math.max(total, 1)) * 100));
  return (
    <div className="w-full h-3 rounded-full bg-brand-peach/30 overflow-hidden">
      <div
        className="h-full rounded-full bg-linear-to-r from-brand-coral to-brand-peach transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
