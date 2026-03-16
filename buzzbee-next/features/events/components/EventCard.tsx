"use client";

import { Heart, Star, MapPin, Calendar, Users, Ticket } from "lucide-react";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/features/favorites/queries";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface EventCardProps {
  event: Event;
  onBookmark?: () => void;
}

export const EventCard = ({ event, onBookmark }: EventCardProps) => {
  const capacity = event.capacity ?? 500;
  const sold = event.attendees ?? 0;
  const left = Math.max(capacity - sold, 0);

  const router = useRouter();
  const { user } = useAuth();
  const { data: favorites } = useFavorites();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const isBookmarked = favorites?.some((fav: { event: { id: string | number } }) => String(fav.event.id) === String(event.id)) ?? false;

  const handleBookmark = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    onBookmark?.();
    
    if (isBookmarked) {
      removeFavorite(event.id);
    } else {
      addFavorite(event.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {event.verified && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star size={12} fill="white" /> Verified
            </span>
          )}
          {event.isFree && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Free
            </span>
          )}
        </div>
        <button
          onClick={handleBookmark}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            size={20}
            fill={isBookmarked ? "#ec4899" : "none"}
            className={isBookmarked ? "text-pink-500" : "text-gray-600"}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
            {event.title}
          </h3>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={16} className="mr-2 text-brand-coral" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2 text-brand-coral" />
            <span>
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              • {event.time}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Users size={16} className="mr-2 text-brand-coral" />
              <span>{event.attendees} attending</span>
            </div>
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" className="mr-1" />
              <span className="font-semibold text-gray-700">
                {event.rating}
              </span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-100 mb-4">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-bold text-gray-700">Tickets</span>
              <span className="text-brand-coral font-bold">{left} left</span>
            </div>
            <ProgressBar value={sold} total={capacity} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-2xl font-bold text-brand-coral">
            {event.isFree ? "Free" : `Rs. ${event.price}`}
          </span>
          <Button
            variant="primary"
            size="sm"
            icon={<Ticket size={16} />}
            onClick={() => {}}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};
