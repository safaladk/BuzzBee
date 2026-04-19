import React from 'react';
import { DollarSign, Tag, Plus, Trash2, Ticket } from 'lucide-react';
import { CreateEventPayload, TicketTier } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface EventTicketingProps {
  formData: CreateEventPayload;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onUpdateTiers: (tiers: TicketTier[]) => void;
}

export function EventTicketing({ formData, onChange, onUpdateTiers }: EventTicketingProps) {
  const tiers = formData.ticketTiers || [];

  const addTier = () => {
    const newTier: TicketTier = {
      name: 'General Admission',
      price: 0,
      capacity: 100,
    };
    onUpdateTiers([...tiers, newTier]);
  };

  const removeTier = (index: number) => {
    const newTiers = tiers.filter((_, i) => i !== index);
    onUpdateTiers(newTiers);
  };

  const updateTier = (index: number, field: keyof TicketTier, value: string | number) => {
    const newTiers = [...tiers];
    newTiers[index] = {
      ...newTiers[index],
      [field]: field === 'name' ? value : Number(value) || 0,
    };
    onUpdateTiers(newTiers);
  };

  return (
    <div className="space-y-8 mt-6">
      {/* Global Ticketing Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            value={formData.serviceFee || ''}
            onChange={onChange}
            placeholder="e.g., 25"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Tag size={18} />
            Max Tickets Per User
          </label>
          <input
            type="number"
            name="maxTicketsPerUser"
            min="0"
            value={formData.maxTicketsPerUser || ''}
            onChange={onChange}
            placeholder="0 for unlimited"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
      </div>

      {/* Ticket Tiers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Ticket size={20} className="text-amber-600" />
            Ticket Tiers (Categories)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTier}
            className="flex items-center gap-2 border-amber-600 text-amber-600 hover:bg-amber-50"
          >
            <Plus size={16} />
            Add Category
          </Button>
        </div>

        {tiers.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500">
            <p>No ticket categories added yet.</p>
            <p className="text-sm">
              Click "Add Category" to create different ticket types (e.g., VIP, Early Bird).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow relative group"
              >
                <button
                  type="button"
                  onClick={() => removeTier(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tier Name */}
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => updateTier(index, 'name', e.target.value)}
                      placeholder="e.g., VIP, General"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm"
                    />
                  </div>

                  {/* Tier Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Price (Rs.)
                    </label>
                    <div className="relative">
                      {/* <span className="absolute left-3 top-2 text-gray-400 text-sm"></span> */}
                      <input
                        type="number"
                        min="0"
                        value={tier.price}
                        onChange={(e) => updateTier(index, 'price', e.target.value)}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm"
                      />
                    </div>
                  </div>

                  {/* Tier Capacity */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Capacity (Tickets)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tier.capacity}
                      onChange={(e) => updateTier(index, 'capacity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legacy Fallback  */}
      {tiers.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign size={18} />
              Basic Price (Rs.)
            </label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={onChange}
              placeholder="0 for free event"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag size={18} />
              Default Capacity
            </label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={formData.capacity || ''}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
