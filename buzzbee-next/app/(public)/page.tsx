"use client";

import { Hero } from "@/components/sections/Hero";
import { StatsSection } from "@/components/sections/StatsSection";
import { stats } from "@/lib/constants";
import { EventsAroundDate } from "@/components/sections/EventsAroundDate";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <StatsSection stats={stats} />
      <EventsAroundDate />
    </div>
  );
}
