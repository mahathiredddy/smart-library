import React, { useState, useMemo } from 'react';
import { Book, Category, ReadingHistoryItem } from '../types';
import { BookCard } from '../components/BookCard';
import { BookCover } from '../components/BookCover';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { useAuth } from '../services/authContext';
import { storage } from '../services/storage';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  BookMarked,
  CheckCircle2,
  Clock,
  Heart,
  TrendingUp,
  FolderTree,
  Search,
  X,
  Library,
  Flame,
  Award,
  Compass,
  Bookmark,
  Calendar,
} from 'lucide-react';

interface UserDashboardPageProps {
  books: Book[];
  categories: Category[];
  favoriteIds: string[];
  onSelectBook: (book: Book) => void;
  onRead: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
  onNavigate: (tab: string, param?: string) => void;
  refreshKey?: number;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  books,
  categories,
  favoriteIds,
  onSelectBook,
  onRead,
  onToggleFavorite,
  onNavigate,
  refreshKey,
}) => {
  const { currentUser } = useAuth();
  const [dashboardSearch, setDashboardSearch] = useState('');

  // Reading history records for current user
  const history: Array<ReadingHistoryItem & { book?: Book }> = currentUser
    ? storage.getUserReadingHistory(currentUser.id)
    : [];

  // Categorize reading progress
  const completedHistory = history.filter((h) => h.progress >= 95);
  const inProgressHistory = history.filter((h) => h.progress > 0 && h.progress < 95);

  // Primary active book for the continue reading hero
  const primaryInProgress = inProgressHistory[0];
  // Secondary in progress books
  const otherInProgressBooks = inProgressHistory.slice(1).map((h) => h.book).filter(Boolean) as Book[];

  // 1. Recently Viewed Books (ordered by lastReadAt)
  const recentlyViewedBooks: Book[] = useMemo(() => {
    const list: Book[] = [];
    const seenIds = new Set<string>();
    for (const h of history) {
      if (h.book && !seenIds.has(h.book.id)) {
        seenIds.add(h.book.id);
        list.push(h.book);
      }
    }
    return list.slice(0, 4);
  }, [history]);

  // 2. Favorite Books
  const favoriteBooks: Book[] = useMemo(() => {
    return books.filter((b) => favoriteIds.includes(b.id)).slice(0, 4);
  }, [books, favoriteIds]);

  // 3. Recommended Books (personalized based on favoriteGenre or rating)
  const recommendedBooks: Book[] = useMemo(() => {
    const userGenre = currentUser?.favoriteGenre?.toLowerCase() || '';
    const genreCategory = categories.find((c) =>
      c.name.toLowerCase().includes(userGenre) || userGenre.includes(c.name.toLowerCase())
    );

    // Prefer books in user's favorite discipline that aren't already completed
    let matches = books.filter(
      (b) =>
        genreCategory &&
        b.categoryId === genreCategory.id &&
        !completedHistory.some((c) => c.bookId === b.id)
    );

    // If not enough matches, add top rated books
    if (matches.length < 4) {
      const topRated = [...books]
        .filter((b) => !matches.some((m) => m.id === b.id))
        .sort((a, b) => b.rating - a.rating);
      matches = [...matches, ...topRated];
    }

    return matches.slice(0, 4);
  }, [books, categories, currentUser?.favoriteGenre, completedHistory]);

  // 4. Recently Added Books (sorted by createdAt)
  const recentlyAddedBooks: Book[] = useMemo(() => {
    return [...books]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [books]);

  // 5. Popular Books (sorted by views + downloads)
  const popularBooks: Book[] = useMemo(() => {
    return [...books]
      .sort((a, b) => b.views + b.downloads - (a.views + a.downloads))
      .slice(0, 4);
  }, [books]);

  // Live in-dashboard search results
  const searchResults: Book[] = useMemo(() => {
    if (!dashboardSearch.trim()) return [];
    const q = dashboardSearch.trim().toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }, [books, dashboardSearch]);

  // Reading Stats
  const totalCompleted = completedHistory.length;
  const totalInProgress = inProgressHistory.length;
  const totalFavorites = favoriteIds.length;
  const averageProgress = history.length
    ? Math.round(history.reduce((acc, h) => acc + h.progress, 0) / history.length)
    : 0;
  // Estimated reading time in minutes (based on pages read and sessions)
  const estimatedReadingMinutes = history.reduce((acc, h) => {
    const totalPages = h.book?.pages || 200;
    const pagesRead = Math.round((totalPages * h.progress) / 100);
    return acc + Math.round(pagesRead * 1.5);
  }, 0);
  const estimatedHours = Math.round((estimatedReadingMinutes / 60) * 10) / 10;

  // Helper to get category name
  const getCatName = (catId: string) => categories.find((c) => c.id === catId)?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      {/* 1. Welcome Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-7 sm:p-10 shadow-xs library-card relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-900 text-amber-200 flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-xs font-serif-display shrink-0 border border-amber-900/40">
              {currentUser?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-950 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/80 font-mono">
                  {currentUser?.role === 'admin' ? 'Curator Admin' : 'Scholar Patron'}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  ID: {currentUser?.id || 'sch-active'}
                </span>
              </div>
              <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
                Welcome back, {currentUser?.name || 'Fellow Scholar'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                Your personalized reading study. Currently pursuing research in{' '}
                <strong className="text-stone-900 font-semibold font-serif-display">
                  {currentUser?.favoriteGenre || 'General Literature & Computing'}
                </strong>.
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('user-profile')}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 transition-colors active:scale-[0.98]"
            >
              Account Dossier
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Reading Statistics Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
            ACADEMIC ENGAGEMENT TELEMETRY
          </span>
          <span className="text-xs text-stone-400 font-mono">
            Real-time reading metrics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* In Progress */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-stone-400 transition-all library-card">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[10px] uppercase font-bold font-mono tracking-wider">
                IN PROGRESS
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-200/70">
                <Clock className="w-4 h-4 text-amber-700" />
              </div>
            </div>
            <p className="text-3xl font-serif-display font-bold text-stone-900 tabular-nums">
              {totalInProgress}
            </p>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">Active sessions</p>
          </div>

          {/* Completed */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-stone-400 transition-all library-card">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[10px] uppercase font-bold font-mono tracking-wider">
                COMPLETED
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
            <p className="text-3xl font-serif-display font-bold text-emerald-800 tabular-nums">
              {totalCompleted}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">Finished works</p>
          </div>

          {/* Saved Favorites */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-stone-400 transition-all library-card">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[10px] uppercase font-bold font-mono tracking-wider">
                FAVORITES
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-800 ring-1 ring-rose-200/70">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
              </div>
            </div>
            <p className="text-3xl font-serif-display font-bold text-stone-900 tabular-nums">
              {totalFavorites}
            </p>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">Curated shelf</p>
          </div>

          {/* Estimated Study Time */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-stone-400 transition-all library-card">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[10px] uppercase font-bold font-mono tracking-wider">
                STUDY TIME
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200/70">
                <Flame className="w-4 h-4 text-indigo-700" />
              </div>
            </div>
            <p className="text-3xl font-serif-display font-bold text-stone-900 tabular-nums">
              {estimatedHours}h
            </p>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">Recorded reading</p>
          </div>

          {/* Avg Completion */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-stone-400 transition-all library-card col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[10px] uppercase font-bold font-mono tracking-wider">
                AVG PROGRESS
              </span>
              <div className="p-2 rounded-xl bg-stone-100 text-stone-800 ring-1 ring-stone-200">
                <Award className="w-4 h-4 text-stone-700" />
              </div>
            </div>
            <p className="text-3xl font-serif-display font-bold text-stone-900 tabular-nums">
              {averageProgress}%
            </p>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">Completion index</p>
          </div>
        </div>
      </section>

      {/* 3. Search Books (In-Dashboard Search Bar) */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs library-card">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
              INSTANT CATALOG QUERY
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900">
              Search Library Repository
            </h2>
            <p className="text-xs text-stone-500">
              Quickly find any book, author, or research keyword across all catalog collections.
            </p>
          </div>

          <div className="pt-2">
            <SearchBar
              value={dashboardSearch}
              onChange={setDashboardSearch}
              placeholder="Search treatises by title, author, or keyword (e.g. Data, Stoic, Quantum)..."
              className="w-full shadow-xs text-sm"
            />
          </div>

          {/* Quick Keywords */}
          {!dashboardSearch && (
            <div className="flex items-center justify-center gap-2 pt-1 text-xs text-stone-500 flex-wrap">
              <span className="font-semibold text-stone-400">Quick explore:</span>
              <button
                onClick={() => setDashboardSearch('Data-Intensive')}
                className="px-2 py-0.5 rounded-md hover:bg-stone-100 hover:text-stone-900 transition-colors font-medium text-stone-600"
              >
                Distributed Systems
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => setDashboardSearch('Meditations')}
                className="px-2 py-0.5 rounded-md hover:bg-stone-100 hover:text-stone-900 transition-colors font-medium text-stone-600"
              >
                Stoic Philosophy
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => setDashboardSearch('Design')}
                className="px-2 py-0.5 rounded-md hover:bg-stone-100 hover:text-stone-900 transition-colors font-medium text-stone-600"
              >
                Architecture
              </button>
            </div>
          )}
        </div>

        {/* Live Search Results Container */}
        {dashboardSearch && (
          <div className="mt-8 pt-6 border-t border-stone-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-stone-700">
                SEARCH RESULTS FOR "{dashboardSearch}" ({searchResults.length} VOLUMES)
              </span>
              <button
                onClick={() => setDashboardSearch('')}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear search</span>
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                <p className="font-serif-display text-lg font-bold text-stone-800">
                  No matching books found
                </p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  No catalog items matched "{dashboardSearch}". Try different keywords or browse by discipline.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((book) => (
                  <BookCard
                    key={`search-${book.id}`}
                    book={book}
                    categoryName={getCatName(book.categoryId)}
                    isFavorite={favoriteIds.includes(book.id)}
                    onViewDetails={onSelectBook}
                    onRead={onRead}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. Continue Reading Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest font-mono">
              ACTIVE SESSIONS
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              Continue Reading
            </h2>
          </div>
          {inProgressHistory.length > 0 && (
            <span className="text-xs font-mono font-semibold text-stone-500">
              {inProgressHistory.length} IN-PROGRESS
            </span>
          )}
        </div>

        {primaryInProgress && primaryInProgress.book ? (
          <div className="space-y-6">
            {/* Primary in-progress book hero card */}
            <div className="bg-stone-900 text-stone-100 rounded-3xl p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-stone-800 library-card">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div
                  onClick={() => onSelectBook(primaryInProgress.book!)}
                  className="w-18 sm:w-22 shrink-0 cursor-pointer shadow-md rounded overflow-hidden hover:scale-105 transition-transform"
                  title="View synopsis and specifications"
                >
                  <BookCover
                    title={primaryInProgress.book.title}
                    author={primaryInProgress.book.author}
                    coverImage={primaryInProgress.book.coverImage}
                    coverColor={primaryInProgress.book.coverColor}
                    size="sm"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                      CURRENT READING POSITION
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      Chapter {(primaryInProgress.currentChapterIndex || 0) + 1}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectBook(primaryInProgress.book!)}
                    className="font-serif-display text-xl sm:text-2xl font-bold text-white hover:text-amber-200 cursor-pointer transition-colors"
                  >
                    {primaryInProgress.book.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    by {primaryInProgress.book.author} &middot;{' '}
                    <span className="text-stone-300 font-mono">
                      {getCatName(primaryInProgress.book.categoryId)}
                    </span>
                  </p>

                  <div className="flex items-center gap-3 mt-3.5">
                    <div className="w-44 h-2 bg-stone-800 rounded-full overflow-hidden ring-1 ring-stone-700">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${primaryInProgress.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-amber-300 font-bold tabular-nums">
                      {primaryInProgress.progress}% read
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons on the continue reading hero */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => onSelectBook(primaryInProgress.book!)}
                  className="flex-1 md:flex-none py-3 px-5 rounded-xl text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => onRead(primaryInProgress.book!)}
                  className="flex-1 md:flex-none py-3 px-6 rounded-xl text-xs font-bold bg-white text-stone-900 hover:bg-amber-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>Resume Reading</span>
                </button>
              </div>
            </div>

            {/* Other in-progress books shelf if user has more than 1 started */}
            {otherInProgressBooks.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                  ALSO IN PROGRESS
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {otherInProgressBooks.map((book) => (
                    <BookCard
                      key={`in-prog-${book.id}`}
                      book={book}
                      categoryName={getCatName(book.categoryId)}
                      isFavorite={favoriteIds.includes(book.id)}
                      onViewDetails={onSelectBook}
                      onRead={onRead}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-10 text-center space-y-3 library-card">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                No active reading session in progress
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Open any volume from our digital repository to start reading in your browser. Your reading progress will save automatically here.
              </p>
            </div>
            <button
              onClick={() => onNavigate('browse')}
              className="py-2.5 px-5 text-xs font-bold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors shadow-2xs active:scale-[0.98]"
            >
              Browse Catalog to Start Reading
            </button>
          </div>
        )}
      </section>

      {/* 5. Recently Viewed Books Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
              SESSION CHRONOLOGY
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              Recently Viewed Books
            </h2>
          </div>
          {recentlyViewedBooks.length > 0 && (
            <button
              onClick={() => onNavigate('reading-history')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-900 transition-colors"
            >
              <span>View Full History ({history.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentlyViewedBooks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/90 p-8 text-center text-xs text-stone-500">
            No recently viewed books recorded yet. Books you explore or read will be indexed here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentlyViewedBooks.map((book) => (
              <BookCard
                key={`recent-viewed-${book.id}`}
                book={book}
                categoryName={getCatName(book.categoryId)}
                isFavorite={favoriteIds.includes(book.id)}
                onViewDetails={onSelectBook}
                onRead={onRead}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. Favorite Books Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest font-mono">
              PERSONAL CURATION
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              Favorite Books
            </h2>
          </div>
          <button
            onClick={() => onNavigate('favorites')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-900 transition-colors"
          >
            <span>View All Saved ({favoriteIds.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {favoriteBooks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/90 p-8 text-center text-xs text-stone-500 space-y-2">
            <p className="font-medium text-stone-700">Your saved shelf is empty.</p>
            <p className="text-stone-400 max-w-sm mx-auto">
              Click the bookmark heart icon on any book card to curate your favorite volumes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteBooks.map((book) => (
              <BookCard
                key={`favorite-${book.id}`}
                book={book}
                categoryName={getCatName(book.categoryId)}
                isFavorite={true}
                onViewDetails={onSelectBook}
                onRead={onRead}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      {/* 7. Recommended Books Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900 uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>CURATOR RECOMMENDATIONS</span>
            </div>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              Recommended for You
            </h2>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-900 transition-colors"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedBooks.map((book) => (
            <BookCard
              key={`rec-${book.id}`}
              book={book}
              categoryName={getCatName(book.categoryId)}
              isFavorite={favoriteIds.includes(book.id)}
              onViewDetails={onSelectBook}
              onRead={onRead}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 8. Recently Added Books Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
              NEW ACCESSIONS
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              Recently Added Books
            </h2>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-900 transition-colors"
          >
            <span>View All Recent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentlyAddedBooks.map((book) => (
            <BookCard
              key={`recent-added-${book.id}`}
              book={book}
              categoryName={getCatName(book.categoryId)}
              isFavorite={favoriteIds.includes(book.id)}
              onViewDetails={onSelectBook}
              onRead={onRead}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 9. Popular Books Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
              <span>COMMUNITY CIRCULATION</span>
            </div>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              Popular Books & Treatises
            </h2>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-900 transition-colors"
          >
            <span>Explore All Popular</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularBooks.map((book) => (
            <BookCard
              key={`popular-${book.id}`}
              book={book}
              categoryName={getCatName(book.categoryId)}
              isFavorite={favoriteIds.includes(book.id)}
              onViewDetails={onSelectBook}
              onRead={onRead}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 10. Categories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
              ACADEMIC DISCIPLINES
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
              Explore by Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-900 transition-colors"
          >
            <span>All Disciplines ({categories.length})</span>
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
    </div>
  );
};
