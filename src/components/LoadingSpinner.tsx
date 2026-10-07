import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-8 text-stone-500 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-stone-700`} />
      {label && <p className="text-xs font-medium text-stone-500 tracking-wide">{label}</p>}
    </div>
  );
};

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-stone-200/80 p-4 animate-pulse flex flex-col gap-3">
      <div className="aspect-[3/4] bg-stone-200 rounded-md w-full" />
      <div className="h-4 bg-stone-200 rounded w-3/4" />
      <div className="h-3 bg-stone-100 rounded w-1/2" />
      <div className="h-3 bg-stone-100 rounded w-1/3" />
      <div className="mt-2 h-8 bg-stone-100 rounded w-full" />
    </div>
  );
};
