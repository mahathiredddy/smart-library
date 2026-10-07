import React from 'react';
import { Book, Category } from '../../types';
import { BookTable } from '../../components/admin/BookTable';
import { Plus, BookOpen } from 'lucide-react';

interface AdminBooksPageProps {
  books: Book[];
  categories: Category[];
  onOpenAddModal: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onToggleAvailability: (bookId: string) => void;
  onPreviewBook: (book: Book) => void;
}

export const AdminBooksPage: React.FC<AdminBooksPageProps> = ({
  books,
  categories,
  onOpenAddModal,
  onEditBook,
  onDeleteBook,
  onToggleAvailability,
  onPreviewBook,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-stone-200/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            BIBLIOGRAPHIC ARCHIVES
          </span>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
            Catalog Volume Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Accession new treatises, update classification metadata, and oversee archival records.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-xs hover:shadow-md flex items-center gap-2 active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 text-amber-300" />
          <span>Accession New Volume</span>
        </button>
      </div>

      <BookTable
        books={books}
        categories={categories}
        onEdit={onEditBook}
        onDelete={onDeleteBook}
        onToggleAvailability={onToggleAvailability}
        onPreview={onPreviewBook}
      />
    </div>
  );
};
