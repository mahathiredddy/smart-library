import React from 'react';
import { Book, Category } from '../types';
import { BookCard } from '../components/BookCard';
import { Heart, ArrowRight, BookMarked, Sparkles } from 'lucide-react';

interface FavoritesPageProps {
  books: Book[];
  categories: Category[];
  favoriteIds: string[];
  onSelectBook: (book: Book) => void;
  onRead: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
  onNavigate: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  books,
  categories,
  favoriteIds,
  onSelectBook,
  onRead,
  onToggleFavorite,
  onNavigate,
}) => {
  const favoriteBooks = books.filter((b) => favoriteIds.includes(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200/80 uppercase tracking-widest mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>PERSONAL SCHOLARLY BOOKSHELF</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">
            Curated Favorites
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Your personal digital bookshelf of bookmarked volumes and research references ({favoriteBooks.length} works saved).
          </p>
        </div>

        <button
          onClick={() => onNavigate('browse')}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-stone-900 bg-stone-100 hover:bg-stone-200/80 transition-colors"
        >
          <span>Explore Entire Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {favoriteBooks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-12 sm:p-16 text-center max-w-md mx-auto space-y-4 shadow-sm library-card">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs border border-rose-100">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-stone-900">
              Your personal shelf is empty
            </h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Click the heart bookmark icon on any catalog volume or details page to curate your personal research collection.
            </p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="py-2.5 px-5 text-xs font-bold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-all shadow-2xs active:scale-[0.98]"
          >
            Browse Catalog to Save Volumes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteBooks.map((book) => {
            const cat = categories.find((c) => c.id === book.categoryId);
            return (
              <BookCard
                key={book.id}
                book={book}
                categoryName={cat?.name}
                isFavorite={true}
                onViewDetails={onSelectBook}
                onRead={onRead}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
