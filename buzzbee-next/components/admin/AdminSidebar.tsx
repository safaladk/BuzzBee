"use client";

import Link from "next/link";
import { LayoutDashboard, CalendarCheck2, Users, BadgeDollarSign } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: CalendarCheck2 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Finance", href: "/admin/finance", icon: BadgeDollarSign },
];

const AdminSidebar = () => {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-[240px] border-r border-slate-200 bg-white flex-col">
      <div className="h-16 px-6 flex items-center border-b border-slate-200">
        <h2 className="text-xl font-black text-brand-navy tracking-tight">BuzzBee Admin</h2>
      </div>

      <nav className="p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-brand-navy hover:bg-brand-peach/20 transition-colors"
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
