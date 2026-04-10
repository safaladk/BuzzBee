"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "../ui/Button";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-[#0f0d0a] min-h-screen flex items-center">
      {/* Coral to White */}
      <div className="absolute inset-0 bg-linear-to-br from-brand-coral/20 via-transparent to-white/10" />
      
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT ko headline */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-coral/10 border border-brand-coral/30 text-brand-coral text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-coral" />
              Welcome to Buzzbee
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight text-white mb-6">
              Find events
              <br />
              worth{" "}
              <em className="text-brand-coral not-italic">
                showing
                <br />
                up
              </em>{" "}
              for !
            </h1>

            <p className="font-sans text-base sm:text-lg text-white/50 leading-relaxed font-light max-w-md">
              From rooftop events in Thamel to mountain trail runs in Pokhara.
              Everything happening near you, in one place.
            </p>
          </div>

          {/* RIGHT ko search */}
          <div className="flex flex-col gap-3">
            <p className="font-sans text-xs text-white/30 uppercase tracking-widest font-medium mb-1">
              Find your next experience
            </p>

            <div className="bg-white/4 border border-white/10 rounded-2xl p-1.5 flex flex-col gap-0.5">
              <div className="flex items-center gap-3 px-5 py-4 bg-white/4 rounded-xl hover:bg-white/[0.07] transition-colors cursor-text">
                <Search className="text-white/30 shrink-0" size={18} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[10px] text-white/30 uppercase tracking-widest mb-0.5">
                    What
                  </p>
                  <input
                    type="text"
                    placeholder="Concerts, workshops, festivals..."
                    className="font-sans bg-transparent outline-none text-sm text-white/65 placeholder-white/30 font-light w-full"
                  />
                </div>
              </div>

              <div className="h-px bg-white/6 mx-1" />

              <div className="flex items-center gap-3 px-5 py-4 bg-white/ rounded-xl hover:bg-white/[0.07] transition-colors cursor-text">
                <MapPin className="text-white/30 shrink-0" size={18} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[10px] text-white/30 uppercase tracking-widest mb-0.5">
                    Where
                  </p>
                  <input
                    type="text"
                    placeholder="Kathmandu, Pokhara, anywhere..."
                    className="font-sans bg-transparent outline-none text-sm text-white/65 placeholder-white/30 font-light w-full"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className=" cursor-pointer mt-1.5 w-full flex items-center justify-center gap-2 rounded-xl"
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