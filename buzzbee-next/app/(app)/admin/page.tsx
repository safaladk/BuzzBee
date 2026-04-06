"use client";

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck,
  MoreVertical,
  Search,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  Settings,
  Menu,
  Bell
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useStats } from "@/features/stats/queries";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: platformStats } = useStats();

  // Dynamic stats for the design
  const stats = [
    { 
      label: "Total Users", 
      value: platformStats ? platformStats.usersCount.toLocaleString() : "...", 
      icon: <Users size={20} />, 
      trend: "+12%", 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Active Events", 
      value: platformStats ? platformStats.eventsCount.toString() : "...", 
      icon: <Calendar size={20} />, 
      trend: "+5%", 
      color: "text-brand-coral", 
      bg: "bg-brand-peach/20" 
    },
    { 
      label: "Total Revenue", 
      value: platformStats ? `Rs. ${(platformStats.totalRevenue / 1000000).toFixed(1)}M` : "...", 
      icon: <DollarSign size={20} />, 
      trend: "+18%", 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
    { 
      label: "Organizers", 
      value: platformStats ? platformStats.organizersCount.toString() : "...", 
      icon: <ShieldCheck size={20} />, 
      trend: "New", 
      color: "text-amber-600", 
      bg: "bg-amber-50" 
    },
  ];

  const recentEvents = [
    { id: 1, title: "Kathmandu Music Fest", organizer: "Melody Events", status: "Verified", date: "2024-05-15", tickets: 450, total: 500 },
    { id: 2, title: "Tech Summit Nepal", organizer: "Fusemachines", status: "Pending", date: "2024-06-10", tickets: 120, total: 300 },
    { id: 3, title: "Himalayan Food Trail", organizer: "Foodies NP", status: "Reported", date: "2024-05-20", tickets: 80, total: 100 },
  ];

  const verificationRequests = [
    { id: 1, name: "Arush Sharma", role: "Individual Organizer", docs: "ID Verified", date: "2 hours ago" },
    { id: 2, name: "Eventia Pvt Ltd", role: "Corporate Organizer", docs: "PAN Verified", date: "5 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Design */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 italic font-black text-2xl text-brand-coral tracking-tighter">
          BuzzBee <span className="text-xs font-bold text-slate-400 align-top not-italic ml-1">ADMIN</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-brand-coral text-white shadow-md shadow-brand-coral/20' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Calendar size={20} /> Events Management
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Users size={20} /> User Accounts
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <ShieldCheck size={20} /> Verifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <DollarSign size={20} /> Finance
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Settings size={20} /> Global Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <Menu className="text-slate-600" />
            <span className="font-bold text-xl text-brand-coral italic">BuzzBee</span>
          </div>
          
          <div className="relative hidden md:block w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users, events or transactions..." 
              className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-coral/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-brand-coral relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Admin User</p>
                <p className="text-[10px] text-slate-500 uppercase font-black mt-1 tracking-wider">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-coral to-brand-peach flex items-center justify-center text-white font-bold shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Overview</h1>
              <p className="text-slate-500 text-sm">Welcome back, here is what&apos;s happening across BuzzBee today.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">Download Report</button>
              <button className="px-4 py-2 bg-brand-coral text-white rounded-xl text-sm font-bold shadow-md shadow-brand-coral/20 hover:scale-[1.02] transition-all">System Health</button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                    {stat.icon}
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.trend}
                  </div>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Events Monitor Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Recent Events Monitor</h2>
                <button className="text-brand-coral text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-6 py-4">Event Name</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Tickets Sold</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{event.title}</p>
                          <p className="text-xs text-slate-400">{event.organizer}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            event.status === 'Verified' ? 'bg-green-50 text-green-700' :
                            event.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            <div className={`w-1 h-1 rounded-full ${
                              event.status === 'Verified' ? 'bg-green-700' :
                              event.status === 'Pending' ? 'bg-amber-700' :
                              'bg-red-700'
                            }`}></div>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[140px]">
                          <div className="flex items-center justify-between mb-1 text-[10px] font-bold">
                            <span className="text-slate-500">{event.tickets}/{event.total}</span>
                            <span className="text-brand-coral">{Math.round((event.tickets/event.total)*100)}%</span>
                          </div>
                          <ProgressBar value={event.tickets} total={event.total} />
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Queue */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
                Verification Queue
                <span className="bg-brand-coral text-white text-[10px] px-2 py-0.5 rounded-full">New</span>
              </h2>
              
              <div className="space-y-6">
                {verificationRequests.map((req) => (
                  <div key={req.id} className="group cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-brand-peach/20 group-hover:text-brand-coral transition-colors">
                          {req.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{req.name}</p>
                          <p className="text-xs text-slate-400">{req.role}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{req.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 bg-slate-50 rounded-lg px-3 py-1.5 flex items-center gap-2 text-[10px] font-bold text-slate-600">
                        <ShieldCheck size={14} className="text-blue-500" /> {req.docs}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-lg bg-green-50 text-green-700 text-[10px] font-black uppercase hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} /> Approve
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                    {req.id === 1 && <div className="mt-6 h-px bg-slate-100"></div>}
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase hover:border-brand-coral hover:text-brand-coral transition-all">
                Access Verification Vault
              </button>
            </div>
          </div>
          
          {/* Quick Analytics Row */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Ecosystem Value</span>
                  <h3 className="text-4xl font-black mt-2 mb-8">Rs. 12,450,900</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-[10px]">U{i}</div>
                       ))}
                    </div>
                    <span className="text-xs text-slate-400 font-bold">+1,200 new users this week</span>
                  </div>
               </div>
               <TrendingUp className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64 group-hover:rotate-12 transition-transform duration-700" />
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Pulse</span>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[98%]"></div>
                  </div>
                  <span className="text-xs font-black text-green-600">98% OPTIMAL</span>
                </div>
                <p className="text-slate-500 text-sm mt-4 italic leading-relaxed">
                  &quot;All payment gateways responding normally. No suspicious activity detected in the last 24 hours.&quot;
                </p>
              </div>
              <div className="flex gap-2 mt-6">
                <div className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black">2FA ENABLED</div>
                <div className="px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-black">SSL SECURE</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
