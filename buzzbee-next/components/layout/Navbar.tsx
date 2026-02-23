"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogIn, Menu, Plus, User, X } from "lucide-react";
import type { User as UserType } from "@/lib/types";
import { Button } from "../ui/Button";
import { useAuth } from "../providers/AuthContext";

interface NavbarProps {
  user: UserType | null;
  onAuthClick: () => void;
}

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleAuthClick = () => {
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                {/* <div className="w-10 h-10 bg-linear-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <svg className="w-6 h-6 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.9 2 10 2.9 10 4C10 4.7 10.4 5.4 11 5.7V7C11 7.6 11.4 8 12 8C12.6 8 13 7.6 13 7V5.7C13.6 5.4 14 4.7 14 4C14 2.9 13.1 2 12 2M16.7 4.3C16.3 3.9 15.7 3.9 15.3 4.3L14.2 5.4C14.4 5.9 14.5 6.4 14.5 7V7.2L16.7 5C17.1 4.6 17.1 4 16.7 4.3M7.3 4.3C6.9 4 6.3 4 5.9 4.3C5.5 4.7 5.5 5.3 5.9 5.7L8.1 7.9V7C8.1 6.4 8.2 5.9 8.4 5.4L7.3 4.3M12 9C9.2 9 7 11.2 7 14C7 16.8 9.2 19 12 19C14.8 19 17 16.8 17 14C17 11.2 14.8 9 12 9M12 11C13.7 11 15 12.3 15 14C15 15.7 13.7 17 12 17C10.3 17 9 15.7 9 14C9 12.3 10.3 11 12 11M11 20V22H13V20H11Z"/>
                  </svg>
                </div> */}
                {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></div> */}
              </div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                BuzzBee
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/events"
              className="group relative text-gray-700 hover:text-brand-coral font-medium transition-colors"
            >
              <span className="relative">
                Discover
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link
              href="#"
              className="group relative text-gray-700 hover:text-brand-coral font-medium transition-colors"
            >
              <span className="relative">
                Categories
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link
              href="#"
              className="group relative text-gray-700 hover:text-brand-coral font-medium transition-colors"
            >
              <span className="relative">
                About
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            {user?.role === "organizer" && (
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                icon={<Plus size={16} />}
                onClick={() => router.push("/organizer/create-event")}
              >
                Create Event
              </Button>
            )}
            <button className="relative p-2 text-gray-600 hover:text-brand-coral transition-colors cursor-pointer">
              <Bell size={22} />
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={profileMenuOpen}
                >
                  <User size={20} className="text-brand-coral" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {user.role}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/login")}
                icon={<LogIn size={16} />}
              >
                Sign In
              </Button>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/events"
              className="group block text-gray-700 hover:text-brand-coral font-medium py-2"
            >
              <span className="relative inline-block">
                Discover
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link
              href="#"
              className="group block text-gray-700 hover:text-brand-coral font-medium py-2"
            >
              <span className="relative inline-block">
                Categories
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            <Link
              href="#"
              className="group block text-gray-700 hover:text-brand-coral font-medium py-2"
            >
              <span className="relative inline-block">
                About
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand-coral transition-all duration-300 ease-out group-hover:w-full"></span>
              </span>
            </Link>
            {user ? (
              <>
                <div className="px-3 py-2 bg-gray-100 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {user.role}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-500 justify-start"
                  onClick={logout}
                  icon={null}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={handleAuthClick}
                icon={null}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
