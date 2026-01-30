'use client';

import { useState } from 'react';
import { Edit2, Trash2, Eye, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface OrganizerEvent {
  id: string;
  title: string;
  date: string;
  attendees: number;
  revenue: number;
  status: 'published' | 'draft' | 'ended';
}

export default function OrganizerDashboardPage() {
  const [events] = useState<OrganizerEvent[]>([
    {
      id: '1',
      title: 'Kathmandu Jazz Festival 2025',
      date: '2025-12-28',
      attendees: 234,
      revenue: 117000,
      status: 'published'
    },
    {
      id: '2',
      title: 'Tech Startup Meetup',
      date: '2025-12-23',
      attendees: 89,
      revenue: 0,
      status: 'published'
    },
    {
      id: '3',
      title: 'Summer Fest 2025',
      date: '2025-08-15',
      attendees: 450,
      revenue: 135000,
      status: 'ended'
    }
  ]);

  const stats = [
    { label: 'Total Events', value: events.length, color: 'bg-purple-500' },
    { label: 'Total Attendees', value: events.reduce((acc, e) => acc + e.attendees, 0), color: 'bg-pink-500' },
    { label: 'Total Revenue', value: `Rs. ${events.reduce((acc, e) => acc + e.revenue, 0)}`, color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your events and track performance</p>
          </div>
          <Link href="/organizer/create-event">
            <Button variant="primary" size="lg" icon={<Plus size={20} />} onClick={() => {}}>
              Create Event
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <BarChart3 className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attendees</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{event.attendees}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.revenue > 0 ? `Rs. ${event.revenue.toLocaleString()}` : 'Free'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
