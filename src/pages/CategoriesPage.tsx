import React from 'react';
import { Category, Book } from '../types';
import { CategoryCard } from '../components/CategoryCard';
import { BookCard } from '../components/BookCard';
import { FolderTree, ArrowRight } from 'lucide-react';

interface CategoriesPageProps {
  categories: Category[];
  books: Book[];
  onSelectCategory: (categoryId: string) => void;
  onSelectBook: (book: Book) => void;
  onRead: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
  favorites: string[];
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  books,
  onSelectCategory,
  onSelectBook,
  onRead,
  onToggleFavorite,
  favorites,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      <div className="border-b border-stone-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-950 bg-amber-50 border border-amber-200/80 uppercase tracking-widest mb-2">
          <FolderTree className="w-3.5 h-3.5 text-amber-700" />
          <span>TAXONOMY & CURATION</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">
          Disciplines & Academic Subjects
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Explore specialized digital collections categorized across {categories.length} core research areas.
        </p>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onClick={() => onSelectCategory(cat.id)}
          />
        ))}
      </div>

      {/* Spotlight breakdown by category */}
      <div className="space-y-12 pt-6">
        {categories.map((cat) => {
          const categoryBooks = books.filter((b) => b.categoryId === cat.id);
          if (categoryBooks.length === 0) return null;

          return (
            <div key={cat.id} className="pt-8 border-t border-stone-200/80 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">{cat.description}</p>
                </div>
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-900 transition-colors"
                >
                  <span>View all {categoryBooks.length} volumes in this field</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryBooks.slice(0, 4).map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    categoryName={cat.name}
                    isFavorite={favorites.includes(book.id)}
                    onViewDetails={onSelectBook}
                    onRead={onRead}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
