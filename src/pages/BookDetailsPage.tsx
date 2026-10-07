import React from 'react';
import { Book, Category } from '../types';
import { BookCover } from '../components/BookCover';
import { BookCard } from '../components/BookCard';
import { useAuth } from '../services/authContext';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';
import {
  ArrowLeft,
  BookOpen,
  Download,
  Heart,
  Star,
  CheckCircle2,
  AlertCircle,
  Share2,
  FileText,
  BookMarked,
  Sparkles,
} from 'lucide-react';

interface BookDetailsPageProps {
  book: Book;
  categories: Category[];
  allBooks: Book[];
  onBack: () => void;
  onRead: (book: Book) => void;
  onSelectBook: (book: Book) => void;
  onToggleFavorite?: (book: Book) => void;
  favorites?: string[];
}

export const BookDetailsPage: React.FC<BookDetailsPageProps> = ({
  book,
  categories,
  allBooks,
  onBack,
  onRead,
  onSelectBook,
  onToggleFavorite,
  favorites = [],
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const isFav = favorites.length > 0
    ? favorites.includes(book.id)
    : (currentUser ? storage.isFavorite(currentUser.id, book.id) : false);
  const category = categories.find((c) => c.id === book.categoryId);

  const relatedBooks = allBooks
    .filter((b) => b.categoryId === book.categoryId && b.id !== book.id)
    .slice(0, 3);

  const handleToggleFavorite = (targetBook: Book = book) => {
    if (onToggleFavorite) {
      onToggleFavorite(targetBook);
      return;
    }

    if (!currentUser) {
      toast('Please log in to bookmark volumes in your favorites.', 'info');
      return;
    }
    const added = storage.toggleFavorite(currentUser.id, targetBook.id);
    toast(
      added
        ? `Added "${targetBook.title}" to your saved shelf.`
        : `Removed "${targetBook.title}" from your favorites.`,
      'success'
    );
  };

  const handleDownload = () => {
    storage.incrementBookDownloads(book.id);
    const content = `================================================
${book.title.toUpperCase()}
by ${book.author}
Published: ${book.publicationYear} | Pages: ${book.pages} | Language: ${book.language}
================================================\n\nSYNOPSIS:\n${book.description}\n\n` +
      book.chapters
        .map((c) => `------------------------------------------------\n${c.title}\n------------------------------------------------\n\n${c.content}\n\n`)
        .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_Library_Edition.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast(`Downloaded "${book.title}" digital edition.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-950 mb-8 transition-colors p-2 rounded-xl hover:bg-stone-100"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Catalog</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Large Book Cover Stage */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm sticky top-24">
            <div className="rounded-3xl overflow-hidden p-8 bg-gradient-to-b from-[#f7f5ef] via-stone-50/60 to-white border border-stone-200/90 flex justify-center shadow-xs">
              <div className="w-full max-w-[280px]">
                <BookCover
                  title={book.title}
                  author={book.author}
                  categoryName={category?.name}
                  coverImage={book.coverImage}
                  coverColor={book.coverColor}
                  size="xl"
                  className="book-shadow-lg mx-auto"
                />
              </div>
            </div>

            {/* Quick stats under cover */}
            <div className="mt-5 p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs flex items-center justify-around text-center text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500 font-mono">
                  RATING
                </p>
                <p className="font-bold text-stone-900 mt-1 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-mono">{book.rating.toFixed(1)}</span>
                </p>
              </div>
              <div className="w-[1px] h-8 bg-stone-100" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500 font-mono">
                  READS
                </p>
                <p className="font-bold text-stone-900 mt-1 tabular-nums font-mono">
                  {book.views}
                </p>
              </div>
              <div className="w-[1px] h-8 bg-stone-100" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500 font-mono">
                  DOWNLOADS
                </p>
                <p className="font-bold text-stone-900 mt-1 tabular-nums font-mono">
                  {book.downloads}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Book Details & Actions */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-amber-950 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/80 uppercase tracking-wider">
                {category?.name || 'General Discipline'}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="font-mono">Published {book.publicationYear}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{book.language}</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.12]">
              {book.title}
            </h1>

            <p className="text-base text-stone-600 mt-3 font-normal">
              Authored by <span className="font-bold text-stone-900">{book.author}</span>
            </p>

            {/* Circulation status badge */}
            <div className="mt-4 flex items-center gap-2">
              {book.availability ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-available" />
                  <span>Available for instantaneous reading & download</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
                  <span>Currently checked out / reserved in archives</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Module: Read Now, Download, Favorite */}
          <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-xs space-y-4 library-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onRead(book)}
                disabled={!book.availability}
                className={`py-3.5 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] ${
                  book.availability
                    ? 'bg-stone-900 text-white hover:bg-stone-800 hover:shadow-md'
                    : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>{book.availability ? 'Read Now' : 'Volume Currently Reserved'}</span>
              </button>

              {book.allowDownload !== false && book.availability && (
                <button
                  onClick={handleDownload}
                  className="py-3.5 px-5 rounded-xl font-bold text-xs border border-stone-300 text-stone-800 hover:bg-stone-50 hover:border-stone-400 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  title="Download offline edition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Archival Edition</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <button
                onClick={() => handleToggleFavorite(book)}
                className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                  isFav
                    ? 'text-rose-600 hover:text-rose-700'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFav ? 'Saved in Personal Bookshelf' : 'Bookmark to My Favorites'}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast('Volume accession link copied to clipboard.', 'info');
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Reference</span>
              </button>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono mb-2">
              SYNOPSIS & SCHOLARLY DISCOURSE
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-normal">
              {book.description}
            </p>
          </div>

          {/* Catalog Specifications */}
          <div className="pt-6 border-t border-stone-200/80">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono mb-3">
              BIBLIOGRAPHIC SPECIFICATIONS
            </h3>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
                <dt className="text-stone-400 uppercase tracking-widest text-[9px] font-bold font-mono">
                  PAGES
                </dt>
                <dd className="text-stone-900 font-bold mt-1 tabular-nums font-mono text-sm">
                  {book.pages}
                </dd>
              </div>

              <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
                <dt className="text-stone-400 uppercase tracking-widest text-[9px] font-bold font-mono">
                  LANGUAGE
                </dt>
                <dd className="text-stone-900 font-bold mt-1 truncate text-sm">
                  {book.language}
                </dd>
              </div>

              <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
                <dt className="text-stone-400 uppercase tracking-widest text-[9px] font-bold font-mono">
                  YEAR
                </dt>
                <dd className="text-stone-900 font-bold mt-1 tabular-nums font-mono text-sm">
                  {book.publicationYear}
                </dd>
              </div>

              <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
                <dt className="text-stone-400 uppercase tracking-widest text-[9px] font-bold font-mono">
                  ARCHIVAL ID
                </dt>
                <dd className="text-stone-900 font-mono font-medium mt-1 truncate text-sm">
                  {book.isbn || '978-ARCHIVE'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Table of Contents preview */}
          {book.chapters && book.chapters.length > 0 && (
            <div className="pt-6 border-t border-stone-200/80">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono mb-3">
                TABLE OF CONTENTS ({book.chapters.length} CHAPTERS)
              </h3>
              <div className="space-y-2">
                {book.chapters.map((ch, idx) => (
                  <div
                    key={ch.id}
                    className="p-3.5 bg-white rounded-xl border border-stone-200/80 flex items-center justify-between text-xs hover:border-stone-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-stone-400 text-[11px] font-semibold">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="font-semibold text-stone-900">{ch.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70 font-semibold">
                      Preserved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <section className="mt-20 pt-10 border-t border-stone-200/80">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono">
                COMPLEMENTARY VOLUMES
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
                More in {category?.name}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard
                key={relBook.id}
                book={relBook}
                categoryName={category?.name}
                isFavorite={
                  favorites.length > 0
                    ? favorites.includes(relBook.id)
                    : (currentUser ? storage.isFavorite(currentUser.id, relBook.id) : false)
                }
                onViewDetails={onSelectBook}
                onRead={onRead}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
