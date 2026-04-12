"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "../ui/Button";

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const q = searchQuery.trim();
    const where = locationQuery.trim();
    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (where) params.set("location", where);

    const query = params.toString();
    router.push(query ? `/events?${query}` : "/events");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-brand-coral/55 to-brand-coral/20 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-coral/10 via-transparent to-white/30" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight text-black mb-6">
              Find events
              <br />
              worth <em className="text-brand-navy">showing up</em>
              <br />
              for!
            </h1>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed font-light max-w-md">
              From rooftop events in Thamel to mountain trail runs in Pokhara.
              Everything happening near you, in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-sans text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">
              Find your next experience
            </p>

            <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-2xl p-1.5 flex flex-col gap-0.5">
              <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl hover:bg-slate-100 transition-colors">
                <Search className="text-slate-400 shrink-0" size={18} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">
                    What
                  </p>
                  <input
                    type="text"
                    placeholder="Concerts, workshops, festivals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="font-sans bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 font-light w-full"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-200 mx-1" />

              <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl hover:bg-slate-100 transition-colors">
                <MapPin className="text-slate-400 shrink-0" size={18} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">
                    Where
                  </p>
                  <input
                    type="text"
                    placeholder="Kathmandu, Pokhara, anywhere..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="font-sans bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 font-light w-full"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleSearch}
                className="cursor-pointer mt-1.5 w-full flex items-center justify-center gap-2 rounded-xl"
              >
                <Search size={18} />
                Search events
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};