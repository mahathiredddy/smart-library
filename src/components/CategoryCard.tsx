import React from 'react';
import { Category } from '../types';
import { BookOpen, Cpu, BookMarked, Layers, Compass, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  BookMarked,
  Layers,
  Compass,
  Sparkles,
  TrendingUp,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onClick,
}) => {
  const IconComponent = (category.iconName && iconMap[category.iconName]) || BookOpen;

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
        isSelected
          ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-lg ring-1 ring-stone-900'
          : 'bg-white text-stone-900 border-stone-200/90 hover:border-stone-400 hover:shadow-md'
      }`}
    >
      <div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-200 ${
            isSelected
              ? 'bg-stone-800 text-amber-300 shadow-xs'
              : 'bg-stone-100/90 text-stone-800 group-hover:bg-amber-50 group-hover:text-amber-900 group-hover:scale-105'
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <h3 className="font-serif-display text-xl font-bold mb-1.5 tracking-tight group-hover:text-amber-950 transition-colors">
          {category.name}
        </h3>

        <p
          className={`text-xs line-clamp-2 leading-relaxed ${
            isSelected ? 'text-stone-300' : 'text-stone-600'
          }`}
        >
          {category.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100/80 flex items-center justify-between text-xs">
        <span
          className={`font-mono text-[11px] font-semibold tabular-nums ${
            isSelected ? 'text-amber-200' : 'text-stone-500'
          }`}
        >
          {category.bookCount} {category.bookCount === 1 ? 'Volume' : 'Volumes'}
        </span>
        <span
          className={`text-xs font-semibold flex items-center gap-1 transition-transform duration-200 group-hover:translate-x-1 ${
            isSelected ? 'text-amber-200' : 'text-stone-800'
          }`}
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
};
