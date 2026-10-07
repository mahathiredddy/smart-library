import React, { useState } from 'react';
import { Book, Category, LibraryStats } from '../types';
import { BookCard } from '../components/BookCard';
import { BookCover } from '../components/BookCover';
import { CategoryCard } from '../components/CategoryCard';
import { SearchBar } from '../components/SearchBar';
import { Sparkles, ArrowRight, Library, BookOpen, ShieldCheck, CheckCircle2, Star, Download, Bookmark } from 'lucide-react';

interface HomePageProps {
  books: Book[];
  categories: Category[];
  stats: LibraryStats;
  onNavigate: (tab: string, filterParam?: string) => void;
  onSelectBook: (book: Book) => void;
  onRead: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
  favorites: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  books,
  categories,
  stats,
  onNavigate,
  onSelectBook,
  onRead,
  onToggleFavorite,
  favorites,
}) => {
  const [heroSearch, setHeroSearch] = useState('');

  const spotlightBook = books.find((b) => b.featured) || books[0];
  const spotlightCategory = categories.find((c) => c.id === spotlightBook?.categoryId);

  const featuredBooks = books.filter((b) => b.featured && b.id !== spotlightBook?.id).slice(0, 4);
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate('browse', heroSearch.trim());
    } else {
      onNavigate('browse');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Editorial Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-stone-200/80 bg-gradient-to-b from-[#f7f5ef]/80 via-[#faf9f6]/95 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Academic Trust Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-stone-200/90 text-stone-700 shadow-2xs">
              <Library className="w-3.5 h-3.5 text-amber-700" />
              <span>Digital Archive & Scholarly Collection</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.08] text-balance">
              The Digital Sanctuary for Scholarly Treatises & Classic Literature
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
              An open digital repository preserving foundational knowledge across distributed systems, stoic philosophy, modern architectural design, and world literature.
            </p>

            {/* Search Bar in Hero */}
            <form onSubmit={handleHeroSearchSubmit} className="pt-2 max-w-xl mx-auto">
              <SearchBar
                value={heroSearch}
                onChange={setHeroSearch}
                placeholder="Search repository by title, author, or keyword..."
                className="w-full text-base shadow-sm"
              />
              <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-stone-500 flex-wrap">
                <span className="font-semibold text-stone-400">Featured Curations:</span>
                <button
                  type="button"
                  onClick={() => onNavigate('browse', 'Data-Intensive')}
                  className="px-2 py-0.5 rounded-md hover:bg-stone-200/80 hover:text-stone-900 transition-colors font-medium text-stone-600"
                >
                  Distributed Systems
                </button>
                <span className="text-stone-300">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('browse', 'Meditations')}
                  className="px-2 py-0.5 rounded-md hover:bg-stone-200/80 hover:text-stone-900 transition-colors font-medium text-stone-600"
                >
                  Stoicism
                </button>
                <span className="text-stone-300">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('browse', 'Design')}
                  className="px-2 py-0.5 rounded-md hover:bg-stone-200/80 hover:text-stone-900 transition-colors font-medium text-stone-600"
                >
                  Architecture & Design
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Curator's Choice Spotlight Banner */}
      {spotlightBook && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden relative library-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Book Cover Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() => onSelectBook(spotlightBook)}
                  className="w-full max-w-[260px] cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
                  title={`View details for ${spotlightBook.title}`}
                >
                  <BookCover
                    title={spotlightBook.title}
                    author={spotlightBook.author}
                    categoryName={spotlightCategory?.name}
                    coverImage={spotlightBook.coverImage}
                    coverColor={spotlightBook.coverColor}
                    size="lg"
                    className="book-shadow-lg mx-auto"
                  />
                </div>
              </div>

              {/* Right: Book Overview */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 uppercase tracking-widest mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>CURATOR'S SPOTLIGHT OF THE MONTH</span>
                  </div>

                  <h2
                    onClick={() => onSelectBook(spotlightBook)}
                    className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 leading-tight hover:text-amber-950 cursor-pointer transition-colors"
                  >
                    {spotlightBook.title}
                  </h2>

                  <p className="text-sm font-medium text-stone-600 mt-2">
                    Authored by <strong className="text-stone-900 font-semibold">{spotlightBook.author}</strong>
                  </p>

                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-3 flex-wrap">
                    <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px] font-mono">
                      {spotlightCategory?.name}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="font-mono">{spotlightBook.publicationYear}</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span>{spotlightBook.pages} pages</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-available" />
                      Available for immediate reading
                    </span>
                  </div>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                  {spotlightBook.description}
                </p>

                <div className="flex items-center gap-3 pt-2 flex-wrap">
                  <button
                    onClick={() => onRead(spotlightBook)}
                    className="py-3 px-6 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-xs hover:shadow-md flex items-center gap-2 active:scale-[0.98]"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>Read Now</span>
                  </button>

                  <button
                    onClick={() => onSelectBook(spotlightBook)}
                    className="py-3 px-5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/90 transition-colors active:scale-[0.98]"
                  >
                    <span>View Specifications</span>
                  </button>

                  <button
                    onClick={() => onToggleFavorite(spotlightBook)}
                    className={`p-3 rounded-xl border transition-all ${
                      favorites.includes(spotlightBook.id)
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
                    }`}
                    title="Toggle Favorite"
                  >
                    <Bookmark className={`w-4 h-4 ${favorites.includes(spotlightBook.id) ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest font-mono mb-1 block">
              CURATED SELECTION
            </span>
            <h2 className="font-serif-display text-3xl font-bold text-stone-900">
              Featured Volumes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-amber-900 transition-colors"
          >
            <span>Explore All Volumes ({books.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => {
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
      </section>

      {/* Disciplinary Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest font-mono mb-1 block">
              RESEARCH FIELDS
            </span>
            <h2 className="font-serif-display text-3xl font-bold text-stone-900">
              Disciplines & Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-amber-900 transition-colors"
          >
            <span>All Categories ({categories.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={() => onNavigate('browse', `category:${cat.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Recently Cataloged Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest font-mono mb-1 block">
              RECENT ACCESSIONS
            </span>
            <h2 className="font-serif-display text-3xl font-bold text-stone-900">
              Recently Cataloged E-Books
            </h2>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-amber-900 transition-colors"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentBooks.map((book) => {
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
      </section>

      {/* Institutional Archival Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase font-bold">
              OPEN ACCESS METRICS
            </span>
            <h3 className="font-serif-display text-3xl sm:text-4xl font-bold mt-1 text-white">
              Preserving Human Insight Through Digital Access
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed">
              Every volume undergoes verification and digital preservation for immediate reading by students, researchers, and global patrons.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-stone-800">
            <div>
              <p className="text-xs text-stone-400 font-mono font-medium">TOTAL VOLUMES</p>
              <p className="text-3xl sm:text-4xl font-bold font-serif-display text-white mt-1 tabular-nums">
                {stats.totalBooks}
              </p>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                {stats.availableBooks} Available for Loan
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-400 font-mono font-medium">REGISTERED READERS</p>
              <p className="text-3xl sm:text-4xl font-bold font-serif-display text-white mt-1 tabular-nums">
                {stats.totalUsers}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">Scholars & Patrons</p>
            </div>

            <div>
              <p className="text-xs text-stone-400 font-mono font-medium">DISCIPLINES</p>
              <p className="text-3xl sm:text-4xl font-bold font-serif-display text-white mt-1 tabular-nums">
                {stats.totalCategories}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">Specialized Fields</p>
            </div>

            <div>
              <p className="text-xs text-stone-400 font-mono font-medium">DOWNLOAD ARCHIVES</p>
              <p className="text-3xl sm:text-4xl font-bold font-serif-display text-white mt-1 tabular-nums">
                {stats.totalDownloads}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">Digital Accessions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
