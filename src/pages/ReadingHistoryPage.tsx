import React from 'react';
import { Book, Category, ReadingHistoryItem } from '../types';
import { BookCover } from '../components/BookCover';
import { Clock, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../services/authContext';
import { storage } from '../services/storage';
import { useToast } from '../components/Toast';

interface ReadingHistoryPageProps {
  books: Book[];
  categories: Category[];
  onRead: (book: Book) => void;
  onSelectBook: (book: Book) => void;
  onNavigate: (tab: string) => void;
  refreshKey: number;
}

export const ReadingHistoryPage: React.FC<ReadingHistoryPageProps> = ({
  books,
  categories,
  onRead,
  onSelectBook,
  onNavigate,
  refreshKey,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [history, setHistory] = React.useState<Array<ReadingHistoryItem & { book?: Book }>>(() =>
    currentUser ? storage.getUserReadingHistory(currentUser.id) : []
  );

  React.useEffect(() => {
    if (currentUser) {
      setHistory(storage.getUserReadingHistory(currentUser.id));
    } else {
      setHistory([]);
    }
  }, [currentUser, refreshKey]);

  const handleClearHistory = () => {
    if (!currentUser) return;
    storage.clearUserReadingHistory(currentUser.id);
    setHistory([]);
    toast('Reading activity logs cleared.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 uppercase tracking-widest mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>SESSION CHRONOLOGY</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">
            Reading History
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Resume your reading sessions and track completion progress across volumes.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Reading Logs</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-14 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto shadow-2xs">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              No active reading sessions
            </h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              When you open an e-book in the reader, your progress and last-read timestamps will automatically be preserved here.
            </p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="py-2.5 px-5 text-xs font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-all shadow-2xs active:scale-[0.98]"
          >
            Open a Volume from Catalog
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/90 divide-y divide-stone-100 overflow-hidden shadow-xs">
          {history.map((item) => {
            if (!item.book) return null;
            const book = item.book;
            const cat = categories.find((c) => c.id === book.categoryId);
            const formattedDate = new Date(item.lastReadAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-stone-50/60 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    onClick={() => onSelectBook(book)}
                    className="w-12 shrink-0 cursor-pointer shadow-2xs rounded overflow-hidden"
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
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
                      <span className="font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                        {cat?.name || 'General'}
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="font-mono text-stone-500">Last accessed {formattedDate}</span>
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

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 shrink-0">
                  {/* Progress tracker */}
                  <div className="w-40 text-right">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                        {item.currentPage ? `PAGE ${item.currentPage}` : 'PROGRESS'}
                      </span>
                      <span className="font-mono font-bold text-stone-900 tabular-nums text-xs">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-stone-900 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Resume button */}
                  <button
                    onClick={() => onRead(book)}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs hover:shadow-md active:scale-[0.98]"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Resume Reading</span>
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
