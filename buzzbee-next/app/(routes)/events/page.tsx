'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Filter } from 'lucide-react';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { EventCard } from '@/components/ui/EventCard';
import { sampleEvents, categories } from '@/lib/constants';
import type { Event } from '@/lib/types';
import Link from 'next/link';

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(sampleEvents);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredEvents(sampleEvents);
    } else {
      setFilteredEvents(sampleEvents.filter((event) => event.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
            </h2>
            <p className="text-gray-600">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Clock size={16} />
              Date
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <EventCard event={event} />
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        )}
      </main>
    </div>
  );
}
