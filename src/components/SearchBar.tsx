import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search volumes by title, author, keyword...',
  className = '',
  autoFocus = false,
}) => {
  // Clear on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && value) {
        onChange('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onChange]);

  return (
    <div className={`relative flex items-center group ${className}`}>
      <Search className="absolute left-4 w-4 h-4 text-stone-500 group-focus-within:text-stone-900 transition-colors pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-11 pr-12 py-3 text-sm bg-white border border-stone-200/90 rounded-2xl placeholder:text-stone-400 text-stone-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-700/60 transition-all shadow-xs"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          aria-label="Clear search query"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <span className="hidden sm:flex absolute right-4 items-center pointer-events-none text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
          ESC
        </span>
      )}
    </div>
  );
};
