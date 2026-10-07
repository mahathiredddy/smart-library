import React, { useState, useMemo } from 'react';
import { Book, Category } from '../types';
import { BookCard } from '../components/BookCard';
import { BookCover } from '../components/BookCover';
import { SearchBar } from '../components/SearchBar';
import { ArrowUpDown, LayoutGrid, List, Eye, BookOpen, Star, X, Filter, Sparkles, RotateCcw } from 'lucide-react';

interface BrowseBooksPageProps {
  books: Book[];
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
  onSelectBook: (book: Book) => void;
  onRead: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
  favorites: string[];
}

export const BrowseBooksPage: React.FC<BrowseBooksPageProps> = ({
  books,
  categories,
  initialSearch = '',
  initialCategory = 'all',
  onSelectBook,
  onRead,
  onToggleFavorite,
  favorites,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'title'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  React.useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  React.useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesSearch =
          !search ||
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()) ||
          book.description.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          selectedCategory === 'all' || book.categoryId === selectedCategory;

        const matchesAvailability =
          availabilityFilter === 'all' ||
          (availabilityFilter === 'available' && book.availability) ||
          (availabilityFilter === 'unavailable' && !book.availability);

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.views + b.downloads) - (a.views + a.downloads);
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.publicationYear - a.publicationYear;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [books, search, selectedCategory, availabilityFilter, sortBy]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setAvailabilityFilter('all');
    setSortBy('popular');
  };

  const isFiltered = search !== '' || selectedCategory !== 'all' || availabilityFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono mb-1 block">
            ACCESSIONS & CATALOG
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">
            Digital Archival Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Browse through scholarly treatises, classical works, and monographs across {categories.length} research disciplines.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl self-start md:self-auto shadow-2xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Compact List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Filter + Sort */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4 library-card">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 max-w-lg">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by title, author, keyword..."
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-semibold text-stone-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-3 bg-stone-50 border border-stone-200/90 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-stone-900 shadow-2xs cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Publication Year</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            {/* Availability filter */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setAvailabilityFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  availabilityFilter === 'all'
                    ? 'bg-white text-stone-950 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAvailabilityFilter('available')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  availabilityFilter === 'available'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setAvailabilityFilter('unavailable')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  availabilityFilter === 'unavailable'
                    ? 'bg-white text-stone-950 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Reserved
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="pt-3 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 uppercase tracking-widest text-[9px] font-bold font-mono shrink-0 mr-1">
            DISCIPLINE:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-950'
            }`}
          >
            All Fields ({books.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
                selectedCategory === c.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-950'
              }`}
            >
              {c.name} ({c.bookCount})
            </button>
          ))}
        </div>
      </div>

      {/* Results Header / Active Filters */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="tabular-nums font-mono text-[11px] font-semibold text-stone-700">
          SHOWING {filteredBooks.length} OF {books.length} CATALOGED VOLUMES
        </span>

        {isFiltered && (
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-1 font-semibold text-stone-800 hover:text-rose-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-14 text-center max-w-md mx-auto space-y-4 shadow-sm library-card">
          <p className="font-serif-display text-2xl font-bold text-stone-900">
            No matching volumes cataloged
          </p>
          <p className="text-xs text-stone-500 leading-relaxed">
            We couldn't locate any works matching your query. Adjust your search keywords or reset filter classifications.
          </p>
          <button
            onClick={resetAllFilters}
            className="py-2.5 px-5 text-xs font-bold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors shadow-2xs active:scale-[0.98]"
          >
            Reset Filters & View All
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const cat = categories.find((c) => c.id === book.categoryId);
            return (
              <BookCard
                key={book.id}
                book={book}
                categoryName={cat?.name}
                isFavorite={favorites.includes(book.id)}
                onViewDetails={onSelectBook}
                onRead={onRead}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-stone-200/90 divide-y divide-stone-100 overflow-hidden shadow-xs">
          {filteredBooks.map((book) => {
            const cat = categories.find((c) => c.id === book.categoryId);
            return (
              <div
                key={book.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-stone-50/60 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    onClick={() => onSelectBook(book)}
                    className="w-12 shrink-0 cursor-pointer shadow-xs rounded overflow-hidden hover:scale-105 transition-transform"
                    title="View details"
                  >
                    <BookCover
                      title={book.title}
                      author={book.author}
                      coverImage={book.coverImage}
                      coverColor={book.coverColor}
                      size="sm"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-0.5">
                      <span className="font-mono text-[10px] font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 uppercase tracking-wider">
                        {cat?.name || 'General'}
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="font-mono">{book.publicationYear}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className={book.availability ? 'text-emerald-700 font-semibold' : 'text-stone-400'}>
                        {book.availability ? 'Available' : 'Reserved'}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectBook(book)}
                      className="font-serif-display text-base font-bold text-stone-900 truncate hover:text-amber-950 cursor-pointer"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-600 truncate">by {book.author}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="flex items-center text-amber-600 gap-1 font-semibold text-xs mr-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono">{book.rating.toFixed(1)}</span>
                  </div>

                  <button
                    onClick={() => onSelectBook(book)}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1.5 active:scale-[0.98]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => onRead(book)}
                    disabled={!book.availability}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-[0.98] ${
                      book.availability
                        ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-2xs'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{book.availability ? 'Read Now' : 'Reserved'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
