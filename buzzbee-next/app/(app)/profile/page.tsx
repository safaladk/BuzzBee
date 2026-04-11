"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import api from "@/lib/axios";
import { User, Mail, Shield, Save, MapPin, Tag, Wallet, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user, refreshUser, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [interestedCategories, setInterestedCategories] = useState<string[]>([]);
  const [interestedLocations, setInterestedLocations] = useState<string[]>([]);

  const AVAILABLE_CATEGORIES = ["Music", "Art", "Food", "Sports", "Technology", "Wellness", "Comedy", "Education"];
  const AVAILABLE_LOCATIONS = ["Kathmandu", "Lalitpur", "Bhaktapur", "Kaski", "Chitwan", "Morang", "Rupandehi", "Jhapa"];

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setInterestedCategories(user.interestedCategories || []);
      setInterestedLocations(user.interestedLocations || []);
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasChanges =
      fullName !== (user?.fullName || "") ||
      JSON.stringify(interestedCategories) !== JSON.stringify(user?.interestedCategories || []) ||
      JSON.stringify(interestedLocations) !== JSON.stringify(user?.interestedLocations || []);

    if (!fullName.trim() || !hasChanges) return;

    setIsUpdating(true);
    setMessage(null);
    try {
      await api.put("/auth/me", {
        fullName,
        interestedCategories,
        interestedLocations,
      });
      await refreshUser();
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch {
      setMessage({
        text: "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-brand-coral border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const initials = (user.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hasChanges =
    fullName !== (user?.fullName || "") ||
    JSON.stringify(interestedCategories) !== JSON.stringify(user?.interestedCategories || []) ||
    JSON.stringify(interestedLocations) !== JSON.stringify(user?.interestedLocations || []);

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-sans">

      <div className="profile-root max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-coral mb-1">Account</p>
          <h1 className="display-font text-4xl text-[#1a1614]">Your Profile</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">

          {/* ── LEFT SIDEBAR */}
          <div className="rounded-2xl w-full lg:w-72 shrink-0 p-7 text-white flex flex-col gap-6 bg-brand-navy/80">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-4 pt-2">
              <div className="relative">
                <div className="avatar-ring w-24 h-24 rounded-full p-[2px]">
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <span className="display-font text-2xl text-[#e8735a] bg-white rounded-full p-4">{initials}</span>
                  </div>
                </div> 
              </div>

              <div className="text-center">
                <p className="font-semibold text-lg leading-tight truncate max-w-[180px]">
                  {user.fullName || "User"}
                </p>
                <p className="text-xs text-white/50 capitalize mt-0.5">{user.role} Account</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
                <Shield size={11} className="text-emerald-400" />
                <span className="text-[11px] text-white/80 font-medium">Active Member</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="stat-chip text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Categories</p>
                <p className="text-xl font-bold text-white">{interestedCategories.length}</p>
              </div>
              <div className="stat-chip text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Locations</p>
                <p className="text-xl font-bold text-white">{interestedLocations.length}</p>
              </div>
            </div>

            {/* Points Card */}
            <div className="points-card rounded-xl p-5">
              <div className="relative z-10 border border-brand-coral rounded-xl px-8 py-12 bg-brand-coral">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet size={14} className="text-white/70" />
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-semibold">BuzzBee Points</p>
                </div>
                <p className="display-font text-4xl font-black text-white mb-2">
                  {user.pointsBalance || 0}
                </p>
                <div className="h-px bg-white/20 mb-3" />
                <p className="text-[11px] text-white/60 leading-relaxed">
                  1 Point = Rs 1 &nbsp;·&nbsp; Redeem at checkout to buy tickets instantly.
                </p>
              </div>
            </div>

            {/* Email (read-only display) */}
            <div className="mt-auto">
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">Email</p>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-white/40" />
                <p className="text-sm text-white/60 truncate">{user.email}</p>
              </div>
              <p className="text-[10px] text-white/25 mt-1 ml-5">Cannot be changed</p>
            </div>
          </div>

          {/* right ko form panel*/}
          <div className="flex-1 flex flex-col gap-5 border border-brand-navy rounded-2xl p-6 bg-white ">

            {/* Toast Message */}
            {message && (
              <div className={`toast-enter flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}>
                {message.type === "success"
                  ? <CheckCircle2 size={17} className="text-emerald-500 flex-shrink-0" />
                  : <XCircle size={17} className="text-red-500 flex-shrink-0" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="flex flex-col gap-5">

              {/* ── Full Name ── */}
              <div className="bg-white rounded-2xl p-6 border border-[#ede9e3]">
                <div className="section-divider">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-brand-coral" />
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#888]">Identity</span>
                  </div>
                </div>

                <label className="block text-sm font-medium text-[#444] mb-2">Full Name</label>
                <input
                  type="text"
                  className="form-input w-full px-4 py-3 border border-[#e5e1da] rounded-xl bg-[#faf9f7] text-[#1a1614] text-sm placeholder:text-[#bbb]"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              {/* ── Categories ── */}
              <div className="bg-white rounded-2xl p-6 border border-[#ede9e3]">
                <div className="section-divider">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-brand-coral" />
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#888]">Interests</span>
                  </div>
                </div>
                <p className="text-sm text-[#888] mb-4">Pick categories you want event alerts for.</p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isSelected = interestedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() =>
                          setInterestedCategories((prev) =>
                            isSelected ? prev.filter((c) => c !== cat) : [...prev, cat]
                          )
                        }
                        className={`tag-btn px-4 py-1.5 rounded-full text-sm font-medium border ${
                          isSelected
                            ? "selected bg-brand-coral text-white border-brand-coral"
                            : "bg-[#faf9f7] text-[#555] border-[#e5e1da] hover:border-brand-coral hover:text-brand-coral"
                        }`}
                      >
                        {isSelected && <span className="mr-1 text-white/70">✓</span>}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Locations ── */}
              <div className="bg-white rounded-2xl p-6 border border-[#ede9e3]">
                <div className="section-divider">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-coral" />
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#888]">Locations</span>
                  </div>
                </div>
                <p className="text-sm text-[#888] mb-4">Districts where you attend events most.</p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_LOCATIONS.map((loc) => {
                    const isSelected = interestedLocations.includes(loc);
                    return (
                      <button
                        type="button"
                        key={loc}
                        onClick={() =>
                          setInterestedLocations((prev) =>
                            isSelected ? prev.filter((l) => l !== loc) : [...prev, loc]
                          )
                        }
                        className={`tag-btn px-4 py-1.5 rounded-full text-sm font-medium border ${
                          isSelected
                            ? "selected bg-brand-coral text-white border-brand-coral"
                            : "bg-[#faf9f7] text-[#555] border-[#e5e1da] hover:border-brand-coral hover:text-brand-coral"
                        }`}
                      >
                        {isSelected && <span className="mr-1 text-white/70">✓</span>}
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Save ── */}
              <div className="flex justify-center p-12">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isUpdating || !fullName.trim() || !hasChanges}
                  className="save-btn rounded-xl px-6 py-3 font-semibold text-sm"
                  icon={<Save size={16} />}
                >
                  {isUpdating ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}