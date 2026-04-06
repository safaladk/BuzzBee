"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import api from "@/lib/axios";
import { User, Mail, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user, refreshUser, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName === user?.fullName) return;

    setIsUpdating(true);
    setMessage(null);
    try {
      await api.put("/auth/me", { fullName });
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-coral"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-brand-peach/30 to-white px-8 py-8 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">
              Manage your personal information and account settings
            </p>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Profile Avatar / Info side */}
              <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
                <div className="w-32 h-32 rounded-full bg-brand-peach/50 flex items-center justify-center text-brand-coral border-4 border-white shadow-md">
                  <User size={64} />
                </div>
                <div className="text-center md:text-left w-full">
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    {user.fullName || "User"}
                  </h2>
                  <p className="text-gray-500 text-sm mb-3 capitalize">
                    {user.role} Account
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full mt-2">
                    <Shield size={14} />
                    Active member
                  </div>
                </div>
              </div>

              {/* Form side */}
              <div className="flex-1">
                {message && (
                  <div
                    className={`p-4 rounded-xl mb-6 text-sm font-medium ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-coral/50 transition-shadow"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                      value={user.email}
                      disabled
                      title="Your email address cannot be changed"
                    />
                    <p className="text-xs text-gray-400 mt-2 ml-1">
                      Email address cannot be changed at this time
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isUpdating || fullName === user.fullName}
                      className="min-w-[140px]"
                      icon={<Save size={18} />}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
