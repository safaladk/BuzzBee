"use client";

import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: Category[];
}

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  categories,
}: CategoryFilterProps) => {
  return (
    <div className="bg-white py-6 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => onSelectCategory(category.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-brand-navy to-brand-coral text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-brand-navy/5"
                }`}
              >
                <Icon size={18} />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
