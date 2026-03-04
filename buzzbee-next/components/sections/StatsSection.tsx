"use client";

import type { Stat } from "@/lib/types";

interface StatsSectionProps {
  stats: Stat[];
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <div className="bg-linear-to-r from-brand-peach/20 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-brand-navy to-brand-coral rounded-2xl mb-4">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
