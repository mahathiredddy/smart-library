import React from 'react';
import { Book } from '../types';
import { BookCover } from './BookCover';
import { Heart, Star, BookOpen, Eye } from 'lucide-react';

interface BookCardProps {
  book: Book;
  categoryName?: string;
  isFavorite?: boolean;
  onViewDetails: (book: Book) => void;
  onRead: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  categoryName,
  isFavorite = false,
  onViewDetails,
  onRead,
  onToggleFavorite,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between library-card transition-all duration-300 hover:border-stone-300">
      {/* Top Cover Section with subtle studio background */}
      <div className="relative p-6 pb-4 bg-gradient-to-b from-[#f6f4ef]/80 via-stone-50/40 to-white flex items-center justify-center border-b border-stone-100/60">
        <div
          onClick={() => onViewDetails(book)}
          className="cursor-pointer transition-transform duration-300 group-hover:scale-[1.03] w-full max-w-[200px]"
          title={`View synopsis and details for ${book.title}`}
        >
          <BookCover
            title={book.title}
            author={book.author}
            categoryName={categoryName}
            coverImage={book.coverImage}
            coverColor={book.coverColor}
            size="md"
            className="book-shadow-hover mx-auto"
          />
        </div>

        {/* Favorite Bookmark Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book);
            }}
            className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-2xs ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200 scale-105 hover:bg-rose-100'
                : 'bg-white/95 text-stone-400 hover:text-stone-800 hover:bg-white hover:scale-105 ring-1 ring-stone-200/80'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Saved in personal bookshelf' : 'Save to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
          </button>
        )}
      </div>

      {/* Book Metadata & Title */}
      <div className="p-5 pt-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Status Bar */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-50/90 px-2 py-0.5 rounded border border-amber-200/70 uppercase tracking-wider truncate max-w-[65%]">
              {categoryName || 'General'}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                book.availability
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  : 'bg-stone-100 text-stone-500 border border-stone-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  book.availability ? 'bg-emerald-500 pulse-available' : 'bg-stone-400'
                }`}
              />
              {book.availability ? 'Available' : 'Reserved'}
            </span>
          </div>

          {/* Book Title */}
          <h3
            onClick={() => onViewDetails(book)}
            className="font-serif-display text-lg font-bold text-stone-900 leading-snug line-clamp-2 hover:text-amber-900 cursor-pointer transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-1">
            by <span className="font-medium text-stone-900">{book.author}</span>
          </p>

          {/* Specs: Rating, Year, Pages */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-2.5">
            <div className="flex items-center text-amber-600 gap-1 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono">{book.rating.toFixed(1)}</span>
            </div>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-mono text-stone-600">{book.publicationYear}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="tabular-nums text-stone-600">{book.pages} pp.</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(book)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/90 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
            title="Inspect full synopsis and contents"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onRead(book)}
            disabled={!book.availability}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] ${
              book.availability
                ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-xs hover:shadow-sm'
                : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
            }`}
            title={book.availability ? 'Read in web viewer' : 'Currently checked out'}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{book.availability ? 'Read Now' : 'Reserved'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
