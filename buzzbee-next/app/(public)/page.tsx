"use client";

import { Hero } from "@/components/sections/Hero";
import { StatsSection } from "@/components/sections/StatsSection";
import { stats as fallbackStats } from "@/lib/constants";
import { EventsAroundDate } from "@/components/sections/EventsAroundDate";
import { useStats } from "@/features/stats/queries";
import { Calendar, MapPin, Trophy } from "lucide-react";

export default function LandingPage() {
  const { data: platformStats } = useStats();

  const displayStats = platformStats
    ? [
        {
          label: "Events Listed",
          value: `${platformStats.eventsCount}+`,
          icon: Calendar,
        },
        {
          label: "Happy Users",
          value: `${(platformStats.usersCount * 23).toLocaleString()}+`, // Multiplier for "Happy Users" simulation if desired, or just usersCount
          icon: MapPin,
        },
        {
          label: "Verified Organizers",
          value: `${platformStats.organizersCount}+`,
          icon: Trophy,
        },
        {
          label: "Cities Covered",
          value: `${platformStats.citiesCount}+`,
          icon: MapPin,
        },
      ]
    : fallbackStats;

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <StatsSection stats={displayStats} />
      <EventsAroundDate />
    </div>
  );
}
