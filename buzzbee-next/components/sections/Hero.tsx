"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "../ui/Button";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* decorative layer removed */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Discover Amazing Events
            <span className="block text-white drop-shadow-sm">
              Happening Around You
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/85 mb-12 leading-relaxed">
            From local community gatherings to major festivals — find, book, and
            experience the best events in Nepal
          </p>

          {/* search container */}
          <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center px-4 py-3 bg-gray-100/80 rounded-xl transition focus-within:ring-2 focus-within:ring-brand-coral">
              <Search className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Search events, concerts, workshops..."
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-400"
              />
            </div>

            <div className="flex-1 flex items-center px-4 py-3 bg-gray-100/80 rounded-xl transition focus-within:ring-2 focus-within:ring-brand-coral">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Kathmandu, Pokhara..."
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-400"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              className="md:w-auto w-full flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
            >
              <Search size={20} />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
