"use client";

import { ComponentType } from "react";
import { TrendingUp } from "lucide-react";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: IconComponent;
  accentClass: string;
  delay?: number;
}

const StatCard = ({ label, value, change, icon: Icon, accentClass }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${accentClass}`}>
          <Icon size={18} />
        </div>
        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          <span>Live</span>
        </div>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <h3 className="text-2xl font-black text-brand-navy mt-1">{value}</h3>
      <p className="text-xs text-slate-500 mt-1">{change}</p>
    </div>
  );
};

export default StatCard;
