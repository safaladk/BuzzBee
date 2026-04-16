import React from "react";
import { DollarSign, Tag } from "lucide-react";
import { CreateEventPayload } from "@/lib/types";

interface EventTicketingProps {
  formData: CreateEventPayload;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function EventTicketing({ formData, onChange }: EventTicketingProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Price */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <DollarSign size={18} />
          Price (Rs.)
        </label>
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={onChange}
          placeholder="0 for free event"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      {/* Capacity */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Tag size={18} />
          Total Tickets
        </label>
        <input
          type="number"
          name="capacity"
          min="1"
          value={formData.capacity || ""}
          onChange={onChange}
          placeholder="e.g., 500"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      {/* Service Fee */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <DollarSign size={18} />
          Service Fee (Rs.)
        </label>
        <input
          type="number"
          name="serviceFee"
          min="0"
          step="0.01"
          value={formData.serviceFee || ""}
          onChange={onChange}
          placeholder="e.g., 25"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      {/* Max Tickets Per User */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Tag size={18} />
          Max Tickets Per User
        </label>
        <input
          type="number"
          name="maxTicketsPerUser"
          min="0"
          value={formData.maxTicketsPerUser || ""}
          onChange={onChange}
          placeholder="0 for unlimited"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>
    </div>
  );
}
