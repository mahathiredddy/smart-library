import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  colorScheme?: 'stone' | 'amber' | 'emerald' | 'blue' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'stone',
  onClick,
}) => {
  const iconColorStyles = {
    stone: 'bg-stone-100 text-stone-800 ring-stone-200/80',
    amber: 'bg-amber-50 text-amber-900 ring-amber-200/80',
    emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-200/80',
    blue: 'bg-blue-50 text-blue-900 ring-blue-200/80',
    rose: 'bg-rose-50 text-rose-800 ring-rose-200/80',
  };

  const accentBars = {
    stone: 'bg-stone-900',
    amber: 'bg-amber-600',
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    rose: 'bg-rose-600',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl border border-stone-200/90 p-5 transition-all duration-300 overflow-hidden ${
        onClick
          ? 'cursor-pointer hover:border-stone-400 hover:shadow-md hover:-translate-y-1 active:scale-[0.99]'
          : 'shadow-2xs'
      }`}
    >
      {/* Subtle top accent highlight on hover */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${accentBars[colorScheme]}`} />

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
            {title}
          </p>
          <h3 className="text-3xl font-serif-display font-bold text-stone-900 mt-1 tabular-nums tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl ring-1 ${iconColorStyles[colorScheme]} transition-transform duration-300 group-hover:scale-110 shadow-2xs shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        {subtitle && (
          <span className="truncate max-w-[70%] text-stone-500 font-medium">
            {subtitle}
          </span>
        )}

        {trend ? (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold font-mono ${
              trend.positive ? 'text-emerald-700' : 'text-stone-500'
            }`}
          >
            <span>{trend.value}</span>
            {trend.positive && <ArrowUpRight className="w-3 h-3 text-emerald-600" />}
          </span>
        ) : onClick ? (
          <span className="text-[10px] font-semibold text-stone-400 group-hover:text-stone-800 transition-colors">
            View &rarr;
          </span>
        ) : null}
      </div>
    </div>
  );
};
