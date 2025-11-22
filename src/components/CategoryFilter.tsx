"use client";

import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange?: (id: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [active, setActive] = useState(selectedCategory || 'all');

  const handleClick = (id: string) => {
    setActive(id);
    onCategoryChange?.(id);
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 pb-4">
        <button
          onClick={() => handleClick('all')}
          className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
            active === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface border border-white/10 hover:border-primary/50'
          }`}
        >
          All Projects
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.id)}
            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
              active === cat.id
                ? 'bg-primary text-white'
                : 'bg-surface border border-white/10 hover:border-primary/50'
            }`}
          >
            {cat.icon && <span className="mr-2">{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
