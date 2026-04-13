"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogIn, Menu, Plus, User, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "@/app/providers/auth-provider";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  useMarkAllRead,
  useMarkRead,
  useNotifications,
} from "@/features/notifications/queries";
import type { Notification } from "@/lib/types";

const navLinks = [
  { label: "Discover", href: "/events" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notificationsRef = useClickOutside<HTMLDivElement>(() => {
    setNotificationsOpen(false);
  });
  const profileMenuRef = useClickOutside<HTMLDivElement>(() => {
    setProfileMenuOpen(false);
  });

  const { data: notifications = [] } = useNotifications(!!user);
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-slate-900 hover:text-brand-coral transition-colors"
          >
            BuzzBee
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative group text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? "text-brand-coral"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-brand-coral transition-all ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
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

            {user && (
              <div className="relative" ref={notificationsRef}>
                <button
                  className="relative p-2 text-gray-600 hover:text-brand-coral transition-colors cursor-pointer"
                  onClick={() => {
                    setNotificationsOpen((prev) => !prev);
                    setProfileMenuOpen(false);
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-800">Notifications</p>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllRead()}
                            className="text-xs font-semibold text-brand-coral hover:text-brand-coral/80 px-2 py-1 rounded-md hover:bg-brand-peach/20 transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
                          aria-label="Close notifications"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification: Notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                              notification.isRead
                                ? "bg-white"
                                : "bg-brand-peach/10 hover:bg-brand-peach/20"
                            }`}
                            onClick={() => {
                              if (!notification.isRead) {
                                markRead(notification.id);
                              }
                            }}
                          >
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="py-10 text-center text-sm text-gray-500">
                          No notifications yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => {
                    setProfileMenuOpen((prev) => !prev);
                    setNotificationsOpen(false);
                  }}
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
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize mt-1">{user.role}</p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block w-full text-left px-4 py-2 text-sm text-brand-coral font-bold hover:bg-brand-peach/10 border-b border-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/favorites"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Favorites
                    </Link>
                    <Link
                      href="/profile"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/ticketing"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Tickets
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                className="cursor-pointer"
                variant="primary"
                size="sm"
                icon={<LogIn size={16} />}
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-brand-coral transition-colors"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-peach/20 text-brand-coral"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <p className="text-xs text-slate-500 capitalize mt-1">{user.role}</p>
                </div>

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-coral hover:bg-brand-peach/15"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {user.role === "organizer" && (
                  <Link
                    href="/organizer/create-event"
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Event
                  </Link>
                )}

                <Link
                  href="/favorites"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Favorites
                </Link>
                <Link
                  href="/profile"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/ticketing"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Tickets
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                icon={<LogIn size={16} />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/login");
                }}
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
