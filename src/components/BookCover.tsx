import React, { useState } from 'react';
import { BookOpen, Sparkles, Feather, Bookmark } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author: string;
  categoryName?: string;
  coverImage?: string;
  coverColor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  categoryName,
  coverImage,
  coverColor = '#1e293b',
  className = '',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  // If valid image provided and didn't fail
  if (coverImage && !imgError) {
    return (
      <div className={`relative overflow-hidden rounded-md book-shadow bg-stone-100 aspect-[3/4] select-none ${className}`}>
        <img
          src={coverImage}
          alt={`Cover of ${title}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Subtle spine highlight & 3D edge depth */}
        <div className="absolute left-0 top-0 bottom-0 w-3 sm:w-3.5 bg-gradient-to-r from-black/45 via-white/15 to-transparent pointer-events-none" />
        <div className="absolute left-3 sm:left-3.5 top-0 bottom-0 w-[1px] bg-black/25 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-stone-400/30 via-white/20 to-stone-400/30 pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/15 pointer-events-none rounded-md" />
      </div>
    );
  }

  // Bespoke hardcover publisher binding sizing
  const sizeClasses = {
    sm: 'text-[11px] p-2.5',
    md: 'text-xs p-3.5 sm:p-4',
    lg: 'text-sm p-5 sm:p-6',
    xl: 'text-base p-6 sm:p-8',
  };

  const titleSizes = {
    sm: 'text-[11px] sm:text-[12px] font-bold leading-tight line-clamp-2',
    md: 'text-xs sm:text-sm font-bold leading-snug line-clamp-3',
    lg: 'text-lg sm:text-xl font-bold leading-snug line-clamp-3',
    xl: 'text-xl sm:text-2xl font-bold leading-tight line-clamp-4',
  };

  return (
    <div
      className={`relative aspect-[3/4] rounded-md book-shadow overflow-hidden select-none flex flex-col justify-between transition-all duration-300 ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: coverColor,
        backgroundImage: `
          radial-gradient(circle at 20% 15%, rgba(255,255,255,0.14) 0%, transparent 60%),
          linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)
        `,
      }}
    >
      {/* Book spine highlight and fold crease */}
      <div className="absolute left-0 top-0 bottom-0 w-3.5 sm:w-4 bg-gradient-to-r from-black/55 via-white/20 to-transparent pointer-events-none" />
      <div className="absolute left-3.5 sm:left-4 top-0 bottom-0 w-[1px] bg-black/35 pointer-events-none" />
      <div className="absolute left-4 sm:left-4.5 top-0 bottom-0 w-[1px] bg-white/15 pointer-events-none" />

      {/* Ribbon bookmark hanging down */}
      <div className="absolute -top-1 right-5 sm:right-6 w-3 sm:w-3.5 h-7 sm:h-8 bg-amber-500/85 shadow-sm rounded-b-xs pointer-events-none flex flex-col justify-end">
        <div className="w-0 h-0 border-l-[6px] sm:border-l-[7px] border-l-transparent border-r-[6px] sm:border-r-[7px] border-r-transparent border-b-[4px] sm:border-b-[5px] border-b-black/20" />
      </div>

      {/* Gold foil framing with ornate corners */}
      <div className="absolute inset-2 sm:inset-2.5 border border-amber-300/30 rounded-xs pointer-events-none">
        <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-amber-300/60" />
        <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-amber-300/60" />
        <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-amber-300/60" />
        <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-amber-300/60" />
      </div>

      {/* Header category kicker */}
      <div className="relative z-10 flex items-center justify-between text-amber-200/80 pl-2 sm:pl-2.5 pr-1">
        <span className="text-[9px] sm:text-[10px] tracking-widest uppercase truncate max-w-[70%] font-semibold font-mono">
          {categoryName || 'TREATISE'}
        </span>
        <Feather className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80 shrink-0 text-amber-200" />
      </div>

      {/* Center Title & Author Block */}
      <div className="relative z-10 my-auto py-2 text-center px-1.5 sm:px-2">
        <div className="inline-flex items-center justify-center mb-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 border border-amber-200/30 text-amber-200/90 shadow-xs">
          <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
        <h4 className={`font-serif-display text-white tracking-wide font-bold drop-shadow-md ${titleSizes[size]}`}>
          {title}
        </h4>
        <div className="w-10 sm:w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent mx-auto my-2" />
        <p className="text-[10px] sm:text-[11px] text-stone-200 font-medium tracking-wide truncate max-w-[95%] mx-auto opacity-95">
          {author}
        </p>
      </div>

      {/* Footer insignia & edition */}
      <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] text-stone-300/90 pl-2 sm:pl-2.5 pr-1 font-mono">
        <span className="tracking-widest opacity-85">EDITION</span>
        <div className="flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-300/70" />
          <span className="opacity-80">ARCHIVE</span>
        </div>
      </div>

      {/* Right page depth shimmer and bevel */}
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-stone-300/60 via-stone-100/50 to-stone-400/60 pointer-events-none" />
    </div>
  );
};
