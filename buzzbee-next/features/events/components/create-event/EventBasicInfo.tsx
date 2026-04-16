import React from "react";
import { Tag } from "lucide-react";
import { CreateEventPayload } from "@/lib/types";

interface EventBasicInfoProps {
  formData: CreateEventPayload;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function EventBasicInfo({ formData, onChange }: EventBasicInfoProps) {
  return (
    <div className="space-y-6">
      {/* Event Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="e.g., Summer Music Festival 2025"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Describe your event in detail..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Tag size={18} />
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
            required
          >
            <option value="Music">Music</option>
            <option value="Art">Art</option>
            <option value="Food">Food</option>
            <option value="Sports">Sports</option>
            <option value="Technology">Technology</option>
            <option value="Wellness">Wellness</option>
          </select>
        </div>

        {/* Highlights */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Event Highlights (comma separated)
          </label>
          <input
            type="text"
            name="highlights"
            value={formData.highlights || ""}
            onChange={onChange}
            placeholder="Live Music, Food Stalls, Cultural Dance"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
      </div>
    </div>
  );
}
