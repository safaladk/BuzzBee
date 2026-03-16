"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useFavorites } from "@/features/favorites/queries";
import { EventCard } from "@/features/events/components/EventCard";
import type { Event } from "@/lib/types";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const { data: favorites, isLoading: isFavoritesLoading } = useFavorites();

  if (loading || isFavoritesLoading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Events you have saved or bookmarked.
        </p>

        {!favorites || favorites.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm mt-8 max-w-2xl mx-auto">
            <Heart size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven&apos;t added any events to your favorites list. Heart
              events you love to keep track of them here!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center justify-center bg-brand-coral text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-coral/90 transition-colors shadow-sm"
            >
              Discover events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav: { id: string | number; event: Event }) => (
              <EventCard key={fav.id} event={fav.event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
