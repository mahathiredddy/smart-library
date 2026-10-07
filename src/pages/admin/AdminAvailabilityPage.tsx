import React, { useState } from 'react';
import { Book, Category } from '../../types';
import { BookCover } from '../../components/BookCover';
import { CheckCircle2, XCircle, Search, ToggleLeft, ToggleRight, RotateCcw } from 'lucide-react';
import { useToast } from '../../components/Toast';

interface AdminAvailabilityPageProps {
  books: Book[];
  categories: Category[];
  onToggleAvailability: (bookId: string) => void;
  onPreviewBook: (book: Book) => void;
}

export const AdminAvailabilityPage: React.FC<AdminAvailabilityPageProps> = ({
  books,
  categories,
  onToggleAvailability,
  onPreviewBook,
}) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const availableCount = books.filter((b) => b.availability).length;
  const unavailableCount = books.length - availableCount;

  const filteredBooks = books.filter((b) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'available' && b.availability) ||
      (filter === 'unavailable' && !b.availability);

    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedBooks = filteredBooks.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const handleToggle = (book: Book) => {
    onToggleAvailability(book.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-3 border-b border-stone-200/80">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
          CIRCULATION AUDIT
        </span>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
          Circulation & Availability Management
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Audit and adjust lending availability status for digital books in real-time.
        </p>
      </div>

      {/* Summary status widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            filter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-1 ring-stone-900'
              : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-400 shadow-2xs'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider font-bold font-mono opacity-70">
            TOTAL CATALOG
          </p>
          <p className="text-3xl font-bold font-serif-display mt-1 tabular-nums">
            {books.length} Volumes
          </p>
          <p className="text-xs mt-1.5 opacity-80">All items under curation</p>
        </button>

        <button
          onClick={() => setFilter('available')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            filter === 'available'
              ? 'bg-emerald-900 text-emerald-50 border-emerald-900 shadow-md ring-1 ring-emerald-900'
              : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-400 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold font-mono text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Available for Readers</span>
          </div>
          <p className="text-3xl font-bold font-serif-display mt-1 text-emerald-800 tabular-nums">
            {availableCount} Volumes
          </p>
          <p className="text-xs mt-1.5 text-emerald-700 font-medium">Ready for open reading</p>
        </button>

        <button
          onClick={() => setFilter('unavailable')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            filter === 'unavailable'
              ? 'bg-rose-950 text-rose-50 border-rose-950 shadow-md ring-1 ring-rose-950'
              : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-400 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold font-mono text-rose-600">
            <XCircle className="w-3.5 h-3.5" />
            <span>Checked Out / Reserved</span>
          </div>
          <p className="text-3xl font-bold font-serif-display mt-1 text-rose-800 tabular-nums">
            {unavailableCount} Volumes
          </p>
          <p className="text-xs mt-1.5 text-rose-700 font-medium">Loan hold active</p>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search volumes by title or author..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-stone-50/70 border border-stone-200/90 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-medium text-stone-900 shadow-2xs transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 font-mono font-semibold tabular-nums">
            Showing {filteredBooks.length} of {books.length} volumes
          </span>

          {(search || filter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="py-1.5 px-2.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards grid for quick toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedBooks.map((book) => {
          const cat = categories.find((c) => c.id === book.categoryId);
          return (
            <div
              key={book.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between library-card ${
                book.availability
                  ? 'bg-white border-stone-200/90 hover:border-stone-400 shadow-2xs'
                  : 'bg-stone-50/80 border-stone-200/70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  onClick={() => onPreviewBook(book)}
                  className="w-12 shrink-0 rounded overflow-hidden shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                  title="Inspect book"
                >
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverImage={book.coverImage}
                    coverColor={book.coverColor}
                    size="sm"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 uppercase tracking-wider">
                    {cat?.name || 'General'}
                  </span>
                  <h4
                    onClick={() => onPreviewBook(book)}
                    className="font-serif-display font-bold text-sm text-stone-900 truncate hover:text-amber-950 cursor-pointer mt-1"
                    title={book.title}
                  >
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 truncate">by {book.author}</p>
                  <p className="text-[10px] text-stone-400 mt-1 font-mono">
                    {book.pages} pages &middot; {book.publicationYear}
                  </p>
                </div>
              </div>

              {/* Action row with live switch */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    book.availability ? 'text-emerald-700' : 'text-stone-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      book.availability ? 'bg-emerald-500 pulse-available' : 'bg-stone-400'
                    }`}
                  />
                  <span>{book.availability ? 'In Circulation' : 'Reserved (Held)'}</span>
                </span>

                <button
                  onClick={() => handleToggle(book)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-[0.98] ${
                    book.availability
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 shadow-2xs'
                      : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300/80 border border-stone-300'
                  }`}
                >
                  {book.availability ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-600" />
                      <span>Set Reserved</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-stone-500" />
                      <span>Make Available</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="font-mono text-xs text-stone-500">
            Showing <strong className="text-stone-900 font-semibold">{Math.min((safeCurrentPage - 1) * pageSize + 1, filteredBooks.length)}</strong> to{' '}
            <strong className="text-stone-900 font-semibold">{Math.min(safeCurrentPage * pageSize, filteredBooks.length)}</strong> of{' '}
            <strong className="text-stone-900 font-semibold">{filteredBooks.length}</strong> volumes
          </span>

          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 text-xs rounded-lg font-semibold transition-all ${
                  safeCurrentPage === num
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
